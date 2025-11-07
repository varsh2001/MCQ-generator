from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import os

app = Flask(__name__)
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app, origins=[os.environ.get('FRONTEND_URL')])
else:
    CORS(app)

# Lazy initialization - don't load models until first request
mcq_generator = None

def get_mcq_generator():
    """Lazy load the MCQ generator to avoid startup errors."""
    global mcq_generator
    if mcq_generator is None:
        try:
            import backend
            mcq_generator = backend.MCQGenerator()
            print("MCQ Generator initialized successfully")
        except Exception as e:
            print(f"Error initializing MCQ Generator: {e}")
            print(traceback.format_exc())
            raise
    return mcq_generator

@app.route('/api/generate', methods=['POST','OPTIONS'])
def generate_quiz():
    """Generate MCQ questions from input text."""
    try:
        # Initialize generator on first request
        generator = get_mcq_generator()
        
        data = request.get_json()
        
        if not data or 'paragraph' not in data:
            return jsonify({
                'ok': False,
                'error': 'Missing required field: paragraph'
            }), 400
        
        text = data['paragraph']
        num_questions = data.get('num_questions', 10)
        qtype = data.get('qtype', 'fill_blank')
        
        # Validate input
        if not text or len(text.strip()) < 50:
            return jsonify({
                'ok': False,
                'error': 'Text is too short. Please provide at least 50 characters.'
            }), 400
        
        # Validate number of questions
        if num_questions < 1 or num_questions > 20:
            num_questions = 10
        
        print(f"Generating {num_questions} questions from text of length {len(text)}")
        
        # Generate questions
        questions = generator.generate_questions(text, num_questions)
        
        if not questions:
            return jsonify({
                'ok': False,
                'error': 'Could not generate questions. Please try with a longer text or different content.'
            }), 400
        
        # Format response to match frontend expectations
        quiz = []
        for q in questions:
            quiz.append({
                'question': q['question'],
                'options': q['options'],
                'answer': q['answer']
            })
        
        print(f"Successfully generated {len(quiz)} questions")
        
        return jsonify({
            'ok': True,
            'quiz': quiz
        })
    
    except ValueError as e:
        print(f"Validation error: {str(e)}")
        return jsonify({
            'ok': False,
            'error': str(e)
        }), 400
    
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            'ok': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'ok': True,
        'status': 'healthy',
        'message': 'MCQ Generator API is running'
    })

@app.route('/', methods=['GET'])
def index():
    """Root endpoint."""
    # List all registered routes for debugging
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'path': str(rule)
        })
    
    return jsonify({
        'message': 'MCQ Generator API',
        'routes': routes,
        'endpoints': {
            'POST /api/generate': 'Generate MCQ questions from text',
            'GET /api/health': 'Health check'
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    print(f"Starting Flask server on port {port}")
    print(f"Debug mode: {debug}")
    
    # Print registered routes
    with app.app_context():
        print("\nRegistered routes:")
        for rule in app.url_map.iter_rules():
            print(f"  {rule.methods} {rule}")
    
    app.run(debug=debug, host='0.0.0.0', port=port)