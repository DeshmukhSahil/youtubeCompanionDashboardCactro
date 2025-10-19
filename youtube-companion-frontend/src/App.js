import React, { useEffect, useState } from 'react';
import './index.css';
import Topbar from './components/Topbar';
import VideoCard from './components/VideoCard';
import CommentsList from './components/CommentsList';
import NotesPanel from './components/NotesPanel';
import { getVideo, getComments, postComment, deleteComment, saveNote, searchNotes } from './api';

function App() {
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [commentsNotice, setCommentsNotice] = useState('');

  useEffect(() => {
    (async () => {
      await fetchVideo();
      await loadComments();
      await loadNotes();
    })();
  }, []);

  async function fetchVideo() {
    try {
      const json = await getVideo();
      setVideo(json?.items?.[0] || null);
    } catch (err) {
      console.error('fetchVideo', err);
      setVideo(null);
    }
  }

  async function loadComments() {
    setCommentsNotice('');
    try {
      const json = await getComments();
      const items = json.items || json || [];
      setComments(items);
    } catch (err) {
      console.warn(err);
      setComments([]);
      setCommentsNotice((err?.response?.data?.error?.message) || 'Comments not available');
    }
  }

  async function addComment(text) {
    try {
      await postComment(text);
      await loadComments();
    } catch (err) {
      console.error('addComment', err);
      alert('Post failed');
    }
  }

  async function removeComment(id) {
    try {
      await deleteComment(id);
      await loadComments();
    } catch (err) {
      console.error('removeComment', err);
      alert('Delete failed');
    }
  }

  async function saveANote(content, tags) {
    try {
      await saveNote(content, tags);
      await loadNotes();
    } catch (err) {
      console.error('saveANote', err);
      alert('Save failed');
    }
  }

  async function loadNotes(q = '') {
    try {
      const ns = await searchNotes(q);
      setNotes(ns || []);
    } catch (err) {
      console.error('loadNotes', err);
      setNotes([]);
    }
  }

  return (
    <div className="page">
      <Topbar onSearch={loadNotes} />

      <main className="layout">
        <section className="left-col">
          <VideoCard video={video} onPostComment={addComment}>
            <div className="card-section">
              <div id="commentsWrap" className="comments-section">
                <CommentsList items={comments} onDelete={removeComment} />
                {commentsNotice ? <div id="commentsNotice" className="muted small">{commentsNotice}</div> : null}
              </div>
            </div>
          </VideoCard>

          <div className="card activity-card">
            <h3 className="section-title">Problem Statement</h3>
            <div id="activity" className="muted">Build a mini-dashboard that connects to the YouTube API and helps users manage one of their uploaded videos in detail:</div>
          </div>
        </section>

        <aside className="right-col">
          <NotesPanel notes={notes} onSave={saveANote} onClear={() => setNotes([])} />
          <div className="card tips">
            <ul className="muted small">
              <li>Made for Kids (MFK) videos have comments disabled by policy.</li>
              <li>You can only delete comments you own or comments on your channel.</li>
              <li>Use the search box to filter notes quickly.</li>
            </ul>
          </div>
        </aside>
      </main>

      <footer className="footer muted small">
        Submission for Cactro’s Full-Stack Development Assessment
      </footer>
    </div>
  );
}

export default App;
