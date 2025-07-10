import React, { useState } from 'react';
import './App.css';
import styles from './App.module.css';
import YouTubePlayer from './components/YouTubePlayer';

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);

    try {
      const urlObject = new URL(url);
      const id = urlObject.searchParams.get('v');
      if (id) {
        setVideoId(id);
      } else {
        setVideoId('');
      }
    } catch (error) {
      console.error(error);
      setVideoId('');
    }
  };

  return (
    <div className="App">
      <h1>YouTube Viewer</h1>
      <input
        className={styles.urlTextInput}
        type="text"
        placeholder="YouTube動画のURLを貼り付け"
        value={youtubeUrl}
        onChange={handleUrlChange}
      />

      <YouTubePlayer videoId={videoId} />
    </div>
  );
}

export default App;
