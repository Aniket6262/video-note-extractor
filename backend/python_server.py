from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import numpy as np
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
import os

app = Flask(__name__)
CORS(app)

video_stores = {}

@app.route('/process', methods=['POST'])
def process_transcript():
    data = request.json
    video_id = data.get('videoId')
    transcript = data.get('transcript')
    openai_key = data.get('apiKey')

    os.environ['OPENAI_API_KEY'] = openai_key

    full_text = '\n'.join([f"[{float(seg.get('start') or 0):.1f}s] {seg['text']}" for seg in transcript if seg.get('text')])

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.create_documents([full_text])

    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_documents(chunks, embeddings)
    video_stores[video_id] = vectorstore

    return jsonify({'status': 'ok', 'chunks': len(chunks)})


@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    video_id = data.get('videoId')
    question = data.get('question')
    openai_key = data.get('apiKey')

    os.environ['OPENAI_API_KEY'] = openai_key

    if video_id not in video_stores:
        return jsonify({'error': 'Video not processed yet'}), 400

    vectorstore = video_stores[video_id]
    retriever = vectorstore.as_retriever(search_kwargs={'k': 4})

    # Modern RAG chain
    prompt = ChatPromptTemplate.from_template("""
    Answer the question based only on the following context from a video transcript.
    Reference timestamps like [123.4s] when relevant.

    Context:
    {context}

    Question: {question}
    """)

    llm = ChatOpenAI(model='gpt-4o-mini', temperature=0)

    def format_docs(docs):
        return '\n\n'.join(doc.page_content for doc in docs)

    chain = (
        {'context': retriever | format_docs, 'question': RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    answer = chain.invoke(question)
    return jsonify({'answer': answer})


@app.route('/whisper', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    filepath = f'temp_{file.filename}'
    file.save(filepath)

    model = whisper.load_model('base')
    result = model.transcribe(filepath)
    os.remove(filepath)

    segments = [{'start': s['start'], 'text': s['text']} for s in result['segments']]
    return jsonify(segments)


if __name__ == '__main__':
    print('Python server running on http://localhost:5000')
    app.run(port=5000)