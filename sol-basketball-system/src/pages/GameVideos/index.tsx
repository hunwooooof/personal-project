import { useEffect, useState } from 'react';
import { collection, db, getDocs } from '../../utils/firebase';
import Video from './Video';

interface VideoType {
  tag: string;
  date: string;
  title: string;
  link: string;
}
function GameVideos() {
  const [topLeague, setTopLeague] = useState<VideoType[]>([]);
  const [friendlyGame, setFriendlyGame] = useState<VideoType[]>([]);

  const data = [
    {
      tag: 'u10',
      date: '2023-11-11',
      link: 'jDL8ePUf0u4',
      title: 'Roadrunners Rookies vs TOP',
      type: 'friendly-game',
    },
  ];

  const getTopLeagueVideos = async () => {
    const videosSnap = await getDocs(collection(db, 'videos', 'roadrunners', 'top-league'));
    const videos: VideoType[] = [];
    videosSnap.forEach((videoSnap) => {
      videos.push(videoSnap.data() as VideoType);
    });
    setTopLeague(videos);
  };

  const getFriendlyGameVideos = async () => {
    const videosSnap = await getDocs(collection(db, 'videos', 'roadrunners', 'friendly-game'));
    const videos: VideoType[] = [];
    videosSnap.forEach((videoSnap) => {
      videos.push(videoSnap.data() as VideoType);
    });
    setFriendlyGame(videos);
  };

  useEffect(() => {
    getTopLeagueVideos();
    getFriendlyGameVideos();
  }, []);

  return (
    <div className='custom-main-container mt-28'>
      <div className='w-10/12 mx-auto'>
        <div className='flex mt-6  px-3 py-2 text-xl border-b border-gray-200 mb-8'>
          <div>Add Video</div>
        </div>
        <div className='border'>
          <div>
            <label className='inline-block w-32 border text-end mr-5' htmlFor='title'>
              Title
            </label>
            <input type='text' className='border w-56 px-2' />
          </div>
          <div>
            <label className='inline-block w-32 border text-end mr-5' htmlFor='date'>
              Date
            </label>
            <input type='date' name='date' id='' className='border w-56 px-2' />
          </div>
          <div>
            <label className='inline-block w-32 border text-end mr-5' htmlFor='tag'>
              Age
            </label>
            <select name='tag' id='' className='border w-56 text-center'>
              <option value='u10'>U10</option>
              <option value='u12'>U12</option>
            </select>
          </div>
          <div>
            <label className='inline-block w-32 border text-end mr-5' htmlFor='link'>
              YouTube Link
            </label>
            https://www.youtube.com/watch?v=
            <input type='text' name='link' id='' className='border w-56 px-2' />
          </div>
        </div>
        <div className='flex mt-6  px-3 py-2 text-xl border-b border-gray-200 mb-8'>
          <div>Top League</div>
          <div className='ml-auto'>
            <select name='tag' id=''>
              <option value='u10'>U10</option>
              <option value='u12'>U12</option>
            </select>
          </div>
        </div>
        <div className='w-full overflow-x-auto'>
          {topLeague.map((game) => {
            return <Video game={game} key={game.link} />;
          })}
        </div>
        <div className='flex mt-6  px-3 py-2 text-xl border-b border-gray-200 mb-8'>
          <div>Friendly Game</div>
        </div>
        <div className='w-full overflow-x-auto'>
          {data.map((game) => {
            return <Video game={game} key={game.link} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default GameVideos;
