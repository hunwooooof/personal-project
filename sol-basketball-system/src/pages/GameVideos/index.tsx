import { useEffect, useState } from 'react';
import { useStore } from '../../store/store';
import { firestore } from '../../utils/firestore';
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

  const sortVideoByDate = (a: VideoType, b: VideoType) => {
    const videoA = new Date(a.date).getTime();
    const videoB = new Date(b.date).getTime();
    return videoA - videoB;
  };

  const getTopLeagueVideos = async () => {
    const videos = (await firestore.getDocs('videos', 'roadrunners', 'top-league')) as VideoType[];
    videos.sort(sortVideoByDate);
    setTopLeague(videos);
    setFilteredTopLeague(videos);
  };

  const getFriendlyGameVideos = async () => {
    const videos = (await firestore.getDocs('videos', 'roadrunners', 'friendly-game')) as VideoType[];
    videos.sort(sortVideoByDate);
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
    firestore
      .setDoc('videos', 'roadrunners', { tag, date, title, youtubeId }, `${newVideo.type}`, newVideo.youtubeId)
      .then(() => {
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

  const labelClass = 'inline-block w-32 text-gray-400';
  const inputClassSm = 'bg-slate-100 py-1 rounded-3xl w-36 px-2 placeholder:text-gray-300';
  const inputClassLg = 'bg-slate-100 py-1 rounded-3xl w-56 px-2 placeholder:text-gray-300';

  return (
    <div className='custom-main-container pt-16'>
      <div className='w-10/12 mx-auto pb-20'>
        {user.role === 'admin' && (
          <div className='mb-8'>
            <div className='custom-page-title mb-4'>
              <div>Add Video</div>
            </div>
            <div className='flex justify-between items-center w-full bg-white rounded-3xl p-10'>
              <div className='flex flex-col gap-3 font-bold'>
                <div>
                  <label className={labelClass} htmlFor='date'>
                    Date
                  </label>
                  <input
                    type='date'
                    name='date'
                    id='date'
                    className={inputClassSm}
                    value={newVideo.date}
                    onChange={handleChangeInput}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor='title'>
                    Title
                  </label>
                  <input
                    type='text'
                    name='title'
                    id='title'
                    className={inputClassLg}
                    value={newVideo.title}
                    placeholder='Roadrunners vs TOP'
                    onChange={handleChangeInput}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor='tag'>
                    Age
                  </label>
                  <select
                    name='tag'
                    id='tag'
                    className={inputClassLg}
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
                  <label className={labelClass} htmlFor='tag'>
                    Type
                  </label>

                  <select
                    name='type'
                    id='type'
                    className={inputClassLg}
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
                  <label className={labelClass} htmlFor='link'>
                    YouTube Link
                  </label>
                  <span className='text-gray-500 text-xs font-normal mr-1'>https://www.youtube.com/watch?v=</span>
                  <input
                    type='text'
                    name='youtubeId'
                    id='youtubeId'
                    className={inputClassSm}
                    value={newVideo.youtubeId}
                    onChange={handleChangeInput}
                    placeholder='07NkJZ2N94M'
                  />
                </div>
                <button
                  className='w-32 mx-auto rounded-full text-white bg-slate-800 mt-4 py-1 hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none'
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
                    <div className='px-2 bg-gray-200 rounded-2xl'>
                      {newVideo.tag === 'u10' ? 'U10' : newVideo.tag === 'u12' ? 'U12' : ''}
                    </div>
                  </div>
                  <div className='font-bold w-72'>{newVideo.title}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className='flex gap-5 items-center mb-6'>
          <div className='custom-page-title'>Top League</div>
          <select
            name='tag'
            id='tag'
            className='px-4 rounded-full py-1 bg-white mt-1'
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
        <div className='mb-5 w-full bg-white rounded-3xl px-10 pt-10 pb-4'>
          <div className='overflow-x-auto flex gap-6 pb-8 px-2 w-full bg-white rounded-md'>
            {filteredTopLeague.map((video) => {
              return <Video key={video.youtubeId} video={video} type='top-league' getVideo={getTopLeagueVideos} />;
            })}
            {filteredTopLeague.length === 0 && (
              <div className='w-full text-center text-gray-400 text-2xl'>Currently no videos available</div>
            )}
          </div>
        </div>
        <div className='custom-page-title mb-6'>
          <div>Friendly Game</div>
        </div>
        <div className='mb-5 w-full bg-white rounded-3xl px-10 pt-10 pb-4'>
          <div className='overflow-x-auto flex gap-6 pb-8 px-2 w-full bg-white rounded-md'>
            {filteredFriendlyGame.map((video) => {
              return (
                <Video key={video.youtubeId} video={video} type='friendly-game' getVideo={getFriendlyGameVideos} />
              );
            })}
            {filteredFriendlyGame.length === 0 && (
              <div className='w-full text-center text-gray-400 text-2xl'>Currently no videos available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameVideos;
