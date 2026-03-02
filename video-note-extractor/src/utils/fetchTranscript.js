import axios from 'axios';

export async function fetchTranscript(videoId) {
  try {
    const res = await axios.get(`http://localhost:3001/transcript/${videoId}`);
    
    if (!res.data || res.data.length === 0) {
      throw new Error('No captions found for this video.');
    }

    return res.data.map(item => ({
      start: item.offset / 1000,  // convert ms to seconds
      text: item.text,
    }));
  } catch (e) {
    if (e.response?.data?.error) {
      throw new Error(e.response.data.error);
    }
    throw new Error('Could not fetch transcript. Make sure the backend is running on port 3001.');
  }
}
