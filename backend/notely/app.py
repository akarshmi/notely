from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import bcrypt
from datetime import datetime
from config import Config
from models import db, User, Note, Tag, note_tags

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
jwt = JWTManager(app)
CORS(app)  # Enable CORS for all routes


# Create database tables
with app.app_context():
    db.create_all()


# Authentication endpoints




@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get("name")
    email = data.get("email")
    password = data.get("password")
    
    if not username or not email or not password:
        return jsonify(message="Missing required fields"), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify(message="Email already registered"), 409
        
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_pw)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(message="User registered successfully"), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify(message="Missing email or password"), 400
        
    user = User.query.filter_by(email=email).first()
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        token = create_access_token(identity=user.email)
        return jsonify(token=token, user={"email": user.email, "username": user.username}), 200
        
    return jsonify(message="Invalid credentials"), 401

# Note management endpoints
@app.route('/api/notes', methods=['GET'])
@jwt_required()
def get_notes():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify(message="User not found"), 404
    
    notes = Note.query.filter_by(user_id=user.id).all()
    
    result = []
    for note in notes:
        tags = [tag.name for tag in note.tags]
        result.append({
            'id': note.id,
            'title': note.title,
            'content': note.content,
            'date': note.date_modified.isoformat(),
            'pinned': note.pinned,
            'tags': tags,
            'wordCount': note.word_count
        })
    
    return jsonify(result), 200



@app.route('/api/notes', methods=['POST'])
@jwt_required()
def create_note():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify(message="User not found"), 404
    
    data = request.get_json()
    title = data.get('title', '')
    content = data.get('content', '')
    pinned = data.get('pinned', False)
    
    # Calculate word count
    word_count = len(content.split()) if content else 0
    
    # Create new note
    new_note = Note(
        title=title,
        content=content,
        pinned=pinned,
        user_id=user.id,
        date_created=datetime.now(),
        date_modified=datetime.now(),
        word_count=word_count
    )
    
    # Process tags
    if 'tags' in data and isinstance(data['tags'], list):
        for tag_name in data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            new_note.tags.append(tag)
    
    db.session.add(new_note)
    db.session.commit()
    
    # Return the created note
    return jsonify({
        'id': new_note.id,
        'title': new_note.title,
        'content': new_note.content,
        'date': new_note.date_modified.isoformat(),
        'pinned': new_note.pinned,
        'tags': [tag.name for tag in new_note.tags],
        'wordCount': new_note.word_count
    }), 201

@app.route('/api/notes/<int:note_id>', methods=['GET'])
@jwt_required()
def get_note(note_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify(message="User not found"), 404
    
    note = Note.query.filter_by(id=note_id, user_id=user.id).first()
    
    if not note:
        return jsonify(message="Note not found"), 404
    
    return jsonify({
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'date': note.date_modified.isoformat(),
        'pinned': note.pinned,
        'tags': [tag.name for tag in note.tags],
        'wordCount': note.word_count
    }), 200

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
@jwt_required()
def update_note(note_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify(message="User not found"), 404
    
    note = Note.query.filter_by(id=note_id, user_id=user.id).first()
    
    if not note:
        return jsonify(message="Note not found"), 404
    
    data = request.get_json()
    
    # Update note fields
    if 'title' in data:
        note.title = data['title']
    if 'content' in data:
        note.content = data['content']
        note.word_count = len(data['content'].split())
    if 'pinned' in data:
        note.pinned = data['pinned']
    
    # Update modification date
    note.date_modified = datetime.now()
    
    # Update tags
    if 'tags' in data and isinstance(data['tags'], list):
        # Remove all existing tags
        note.tags = []
        
        # Add new tags
        for tag_name in data['tags']:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            note.tags.append(tag)
    
    db.session.commit()
    
    return jsonify({
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'date': note.date_modified.isoformat(),
        'pinned': note.pinned,
        'tags': [tag.name for tag in note.tags],
        'wordCount': note.word_count
    }), 200

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
@jwt_required()
def delete_note(note_id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify(message="User not found"), 404
    
    note = Note.query.filter_by(id=note_id, user_id=user.id).first()
    
    if not note:
        return jsonify(message="Note not found"), 404
    
    db.session.delete(note)
    db.session.commit()
    
    return jsonify(message="Note deleted successfully"), 200

@app.route('/api/notes/stats', methods=['GET'])
@jwt_required()
def get_note_stats():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify(message="User not found"), 404
    
    notes = Note.query.filter_by(user_id=user.id).all()
    
    total_notes = len(notes)
    total_words = sum(note.word_count for note in notes)
    pinned_count = len([note for note in notes if note.pinned])
    
    # Calculate notes modified in the last 7 days
    seven_days_ago = datetime.now() - datetime.timedelta(days=7)
    recently_edited = len([note for note in notes if note.date_modified >= seven_days_ago])
    
    return jsonify({
        'total': total_notes,
        'totalWords': total_words,
        'pinnedCount': pinned_count,
        'recentlyEdited': recently_edited
    }), 200

if __name__ == '__main__':
    app.run(debug=True)