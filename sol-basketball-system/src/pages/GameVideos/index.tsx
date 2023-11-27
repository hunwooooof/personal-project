import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { collection, db, doc, getDocs, setDoc } from '../../utils/firebase';
import Video from './Video';

interface VideoType {
  tag: string;
  date: string;
  title: string;
  youtubeId: string;
  type?: string;
}
function GameVideos() {
  const { user, isLogin } = useStore();
  const [topLeague, setTopLeague] = useState<VideoType[]>([]);
  const [friendlyGame, setFriendlyGame] = useState<VideoType[]>([]);
  const [filteredTopLeague, setFilteredTopLeague] = useState<VideoType[]>(topLeague);
  const [filteredFriendlyGame, setFilteredFriendlyGame] = useState<VideoType[]>(friendlyGame);
  const [newVideo, setNewVideo] = useState<VideoType>({
    tag: '',
    date: '',
    title: '',
    youtubeId: '',
    type: '',
  });

  const getTopLeagueVideos = async () => {
    const videosSnap = await getDocs(collection(db, 'videos', 'roadrunners', 'top-league'));
    const videos: VideoType[] = [];
    videosSnap.forEach((videoSnap) => {
      videos.push(videoSnap.data() as VideoType);
    });
    videos.sort((a, b) => {
      const videoA = new Date(a.date).getTime();
      const videoB = new Date(b.date).getTime();
      return videoA - videoB;
    });
    setTopLeague(videos);
    setFilteredTopLeague(videos);
  };

  const getFriendlyGameVideos = async () => {
    const videosSnap = await getDocs(collection(db, 'videos', 'roadrunners', 'friendly-game'));
    const videos: VideoType[] = [];
    videosSnap.forEach((videoSnap) => {
      videos.push(videoSnap.data() as VideoType);
    });
    videos.sort((a, b) => {
      const videoA = new Date(a.date).getTime();
      const videoB = new Date(b.date).getTime();
      return videoA - videoB;
    });
    setFriendlyGame(videos);
    setFilteredFriendlyGame(videos);
  };

  useEffect(() => {
    getTopLeagueVideos();
    getFriendlyGameVideos();
  }, [isLogin]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setNewVideo({ ...newVideo, [id]: e.target.value.trim() });
  };

  const handleSubmit = () => {
    const { tag, date, title, youtubeId, type } = newVideo;
    setDoc(doc(db, 'videos', 'roadrunners', `${newVideo.type}`, newVideo.youtubeId), {
      tag,
      date,
      title,
      youtubeId,
    }).then(() => {
      type === 'top-league' ? getTopLeagueVideos() : getFriendlyGameVideos();
    });
    setNewVideo({
      tag: '',
      date: '',
      title: '',
      youtubeId: '',
      type: '',
    });
  };

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 mx-auto pb-20'>
        {user.role === 'admin' && (
          <div>
            <div className='flex mt-6  px-3 py-2 text-xl border-b border-gray-200 mb-8'>
              <div>Add Video</div>
            </div>
            <div className='flex justify-between items-center w-11/12 mx-auto'>
              <div className='flex flex-col gap-2'>
                <div>
                  <label className='inline-block w-32 text-gray-800 text-center' htmlFor='date'>
                    Date
                  </label>
                  <input
                    type='date'
                    name='date'
                    id='date'
                    className='border border-gray-800 py-1 rounded-lg px-2 w-36'
                    value={newVideo.date}
                    onChange={handleChangeInput}
                    required
                  />
                </div>
                <div>
                  <label className='inline-block w-32 text-gray-800 text-center' htmlFor='title'>
                    Title
                  </label>
                  <input
                    type='text'
                    name='title'
                    id='title'
                    className='border border-gray-800 py-1 rounded-lg w-56 px-2'
                    value={newVideo.title}
                    placeholder='Roadrunners vs TOP'
                    onChange={handleChangeInput}
                    required
                  />
                </div>

                <div>
                  <label className='inline-block w-32 text-gray-800 text-center' htmlFor='tag'>
                    Age
                  </label>
                  <select
                    name='tag'
                    id='tag'
                    className='border border-gray-800 py-1 rounded-lg w-56 px-2'
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewVideo({
                        ...newVideo,
                        tag: value,
                      });
                    }}>
                    <option value='' selected>
                      Select age
                    </option>
                    <option value='u10'>U10</option>
                    <option value='u12'>U12</option>
                  </select>
                </div>
                <div>
                  <label className='inline-block w-32 text-gray-800 text-center' htmlFor='tag'>
                    Type
                  </label>

                  <select
                    name='type'
                    id='type'
                    className='border border-gray-800 py-1 rounded-lg w-56 px-2'
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewVideo({
                        ...newVideo,
                        type: value,
                      });
                    }}>
                    <option value='' selected>
                      Select game type
                    </option>
                    <option value='top-league'>Top League</option>
                    <option value='friendly-game'>Friendly Game</option>
                  </select>
                </div>
                <div>
                  <label className='inline-block w-32 text-gray-800 text-center' htmlFor='link'>
                    YouTube Link
                  </label>
                  <span className='text-gray-500 text-sm font-serif'>https://www.youtube.com/watch?v=</span>
                  <input
                    type='text'
                    name='youtubeId'
                    id='youtubeId'
                    className='border border-gray-800 py-1 rounded-lg w-36 px-2'
                    value={newVideo.youtubeId}
                    onChange={handleChangeInput}
                    placeholder='07NkJZ2N94M'
                  />
                </div>
                <button
                  className='w-32 mx-auto rounded-md text-white bg-green-800 mt-4 py-1 shadow-lg hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none'
                  onClick={handleSubmit}
                  disabled={
                    Object.values(newVideo).some((item) => item.length === 0) || newVideo.youtubeId.length !== 11
                  }
                  type='submit'>
                  Add Video
                </button>
              </div>
              <div className='p-2 border shadow-md' id='video-demonstrate'>
                <iframe
                  src={`https://www.youtube.com/embed/${newVideo.youtubeId}`}
                  title='YouTube video player'
                  width='300'
                  height='180'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                />
                <div className='flex flex-col gap-2 mt-2'>
                  <div className='flex justify-between items-center'>
                    <div className='font-bold text-gray-500 tracking-wider'>{newVideo.date}</div>
                    <div className='px-2 bg-green-200 rounded-2xl'>
                      {newVideo.tag === 'u10' ? 'U10' : newVideo.tag === 'u12' ? 'U12' : ''}
                    </div>
                  </div>
                  <div className='font-bold w-72'>{newVideo.title}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='flex px-3 py-2 text-xl border-b border-gray-200 mb-8 mt-16'>
          <div>Top League</div>
          <div className='ml-auto'>
            <select
              name='tag'
              id='tag'
              className='text-md px-2'
              onChange={(e) => {
                if (e.target.value === 'u10') {
                  setFilteredTopLeague(topLeague.filter((video) => video.tag === 'u10'));
                  setFilteredFriendlyGame(friendlyGame.filter((video) => video.tag === 'u10'));
                } else if (e.target.value === 'u12') {
                  setFilteredTopLeague(topLeague.filter((video) => video.tag === 'u12'));
                  setFilteredFriendlyGame(friendlyGame.filter((video) => video.tag === 'u12'));
                } else {
                  setFilteredTopLeague(topLeague);
                  setFilteredFriendlyGame(friendlyGame);
                }
              }}>
              <option value='all'>All</option>
              <option value='u10'>U10</option>
              <option value='u12'>U12</option>
            </select>
          </div>
        </div>
        <div className='w-11/12 mx-auto overflow-x-auto flex gap-6 pb-5'>
          {filteredTopLeague.map((video) => {
            return <Video key={video.youtubeId} video={video} type='top-league' getVideo={getTopLeagueVideos} />;
          })}
          {filteredTopLeague.length === 0 && (
            <div className='w-full text-center text-gray-400'>Currently no videos available</div>
          )}
        </div>
        <div className='flex px-3 py-2 text-xl border-b border-gray-200 mb-8 mt-16'>
          <div>Friendly Game</div>
        </div>
        <div className='w-11/12 mx-auto overflow-x-auto flex gap-6 pb-5'>
          {filteredFriendlyGame.map((video) => {
            return <Video key={video.youtubeId} video={video} type='friendly-game' getVideo={getFriendlyGameVideos} />;
          })}
          {filteredFriendlyGame.length === 0 && (
            <div className='w-full text-center text-gray-400'>Currently no videos available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameVideos;
