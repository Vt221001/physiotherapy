import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Pause, Play } from 'lucide-react';
import { AppointmentLink, assessmentPhoto, Eyebrow } from './components.jsx';
import { installCinemaMotion } from './cinemaMotion.js';
import './cinema.css';

const chapters = [
  {
    label: 'Understand',
    title: 'Start with what changed.',
    text: 'At your first visit, talk through what feels different and pick a movement you’d like to get back to.',
    src: assessmentPhoto.src,
    alt: assessmentPhoto.alt,
    width: 883,
    height: 887,
  },
  {
    label: 'Rebuild',
    title: 'Practise what matters to you.',
    text: 'Agree on a manageable starting point. Your plan might include practising an everyday task, such as carrying a bag.',
    src: '/images/story-rebuild.jpg',
    alt: 'Illustrative photograph of a woman practising carrying a bag with a physiotherapist nearby.',
    width: 1024,
    height: 1024,
  },
  {
    label: 'Return',
    title: 'Take it back into daily life.',
    text: 'Review how the task feels outside the clinic and decide together what to work on next.',
    src: '/images/story-return.jpg',
    alt: 'Illustrative photograph of the same woman walking outdoors with a market bag.',
    width: 1024,
    height: 1024,
  },
];

const chapterDuration = 5200;

export function HomeCinema() {
  const [chapter, setChapter] = useState(0);
  const [imageChapter, setImageChapter] = useState(0);
  const [firstImageReady, setFirstImageReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stage = useRef(null);
  const canvas = useRef(null);
  const images = useRef([]);
  const gesture = useRef(null);
  const requested = useRef(0);

  const selectChapter = useCallback((index) => {
    requested.current = index;
    setChapter(index);
    const image = images.current[index];
    if (image?.complete && image.naturalWidth) setImageChapter(index);
  }, []);

  useEffect(() => installCinemaMotion(stage.current, canvas.current), []);

  useEffect(() => {
    if (!playing) return;
    const next = window.setTimeout(() => {
      if (chapter < chapters.length - 1) selectChapter(chapter + 1);
      else setPlaying(false);
    }, chapterDuration);
    return () => window.clearTimeout(next);
  }, [chapter, playing, selectChapter]);

  function chooseChapter(index) {
    setPlaying(false);
    selectChapter(index);
  }

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
    } else {
      if (chapter === chapters.length - 1) selectChapter(0);
      setPlaying(true);
    }
  }

  function startGesture(event) {
    if (!event.isPrimary || event.button !== 0) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function finishGesture(event) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 42 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
    const next = Math.min(chapters.length - 1, Math.max(0, chapter + (dx < 0 ? 1 : -1)));
    chooseChapter(next);
  }

  const scene = chapters[chapter];

  return (
    <section className="cinema-hero" aria-labelledby="home-heading">
      <div className="container cinema-grid">
        <div className="cinema-intro">
          <Eyebrow>Physiotherapy in Jaunpur</Eyebrow>
          <h1 id="home-heading">Find your way <em>back to motion.</em></h1>
          <p className="lead">Personalised physiotherapy for pain, injury and rehabilitation, built around the movements you want to get back to.</p>
          <div className="cinema-actions">
            <AppointmentLink className="button button-light" />
            <Link to="/services" className="cinema-services-link">Explore services</Link>
          </div>
        </div>

        <div className="cinema-player" role="region" aria-label="Illustrated physiotherapy journey" style={{ '--chapter-duration': chapterDuration + 'ms' }}>
          <div
            className="cinema-stage"
            ref={stage}
            data-chapter={imageChapter}
            onPointerDown={startGesture}
            onPointerUp={finishGesture}
            onLostPointerCapture={() => { gesture.current = null; }}
          >
            <div className="cinema-depth">
              {chapters.map(({ label, src, alt, width, height }, index) => (
                <img
                  key={label}
                  ref={(image) => { images.current[index] = image; }}
                  className={'cinema-image' + (index === imageChapter ? ' is-active' : '')}
                  src={index === 0 || firstImageReady || index === chapter ? src : undefined}
                  alt={alt}
                  width={width}
                  height={height}
                  draggable="false"
                  aria-hidden={index !== imageChapter}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding={index === 0 ? 'auto' : 'async'}
                  onLoad={() => {
                    if (index === 0) setFirstImageReady(true);
                    if (requested.current === index) setImageChapter(index);
                  }}
                />
              ))}
            </div>
            <div key={imageChapter} className="cinema-flare" aria-hidden="true" />
            <canvas ref={canvas} className="cinema-ribbons" aria-hidden="true" />
            <div className="cinema-shade" aria-hidden="true" />
            <span className="cinema-meter" aria-hidden="true">0{chapter + 1} <i /> 0{chapters.length}</span>
            <div id="cinema-caption" className="cinema-caption" aria-live={playing ? 'off' : 'polite'}>
              <div key={scene.label} className="cinema-caption-copy">
                <h2>{scene.title}</h2>
                <p>{scene.text}</p>
              </div>
            </div>
          </div>

          <div className="cinema-control">
            <div className="cinema-control-heading">
              <div><strong>Explore the journey</strong><span>Swipe the scene or choose a chapter.</span></div>
              <button className="cinema-play" type="button" onClick={togglePlayback} aria-controls="cinema-caption">
                {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
                {playing ? 'Pause story' : 'Play story'}
              </button>
            </div>
            <div className="cinema-chapters" role="group" aria-label="Story chapters">
              {chapters.map(({ label }, index) => (
                <button key={label} type="button" aria-pressed={chapter === index} aria-controls="cinema-caption" onClick={() => chooseChapter(index)}>
                  <span className={playing && chapter === index ? 'chapter-progress is-playing' : 'chapter-progress'} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
