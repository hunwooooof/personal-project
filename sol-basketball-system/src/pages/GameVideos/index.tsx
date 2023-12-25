import { Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import { useStore } from '../../store/store';
import { collection, db, onSnapshot } from '../../utils/firestore';
import { VideoType } from '../../utils/types';
import AddVideo from './AddVideo';
import Video from './Video';

function GameVideos() {
  const { user, setCurrentNav } = useStore();
  const [topLeague, setTopLeague] = useState<VideoType[]>([]);
  const [friendlyGame, setFriendlyGame] = useState<VideoType[]>([]);
  const [filteredTopLeague, setFilteredTopLeague] = useState<VideoType[]>(topLeague);
  const [filteredFriendlyGame, setFilteredFriendlyGame] = useState<VideoType[]>(friendlyGame);

  useEffect(() => {
    setCurrentNav('videos');
  }, []);

  const sortVideoByDate = (a: VideoType, b: VideoType) => {
    const videoA = new Date(a.date).getTime();
    const videoB = new Date(b.date).getTime();
    return videoA - videoB;
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'videos', 'roadrunners', 'top-league'), (docSnaps) => {
      const docArray: VideoType[] = [];
      docSnaps.forEach((docSnap) => {
        docArray.push(docSnap.data() as VideoType);
      });
      setTopLeague(docArray.sort(sortVideoByDate));
      setFilteredTopLeague(docArray.sort(sortVideoByDate));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'videos', 'roadrunners', 'friendly-game'), (docSnaps) => {
      const docArray: VideoType[] = [];
      docSnaps.forEach((docSnap) => {
        docArray.push(docSnap.data() as VideoType);
      });
      setFriendlyGame(docArray.sort(sortVideoByDate));
      setFilteredFriendlyGame(docArray.sort(sortVideoByDate));
    });
    return () => unsubscribe();
  }, []);

  const filterTag = [
    { value: 'all', label: 'All' },
    { value: 'u10', label: 'U10' },
    { value: 'u12', label: 'U12' },
  ];

  return (
    <div className='custom-main-container'>
      {user.role === 'admin' && <AddVideo />}
      <div className='pt-6 lg:pt-14 w-full flex justify-between items-center px-10 md:px-0'>
        <PageTitle title='Top League' />
        <div className='mr-0 md:mr-12 lg:mr-20 flex w-20 flex-wrap md:flex-nowrap gap-4 text-black'>
          <Select
            isRequired
            color='default'
            size='sm'
            defaultSelectedKeys={['all']}
            classNames={{
              trigger: 'min-h-unit-0 py-0 h-8',
            }}
            radius='full'
            id='tag'
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
            {filterTag.map((tag) => (
              <SelectItem key={tag.value} value={tag.value}>
                {tag.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <div className='w-full pt-10 pb-4 border-b border-gray-600 px-10 md:px-0'>
        <div className='mx-0 md:mx-12 lg:mx-20 overflow-x-auto flex gap-6 pb-4 mb-8'>
          {filteredTopLeague.map((video) => {
            return <Video key={video.youtubeId} video={video} type='top-league' />;
          })}
          {filteredTopLeague.length === 0 && (
            <div className='w-full text-center text-gray-600 text-2xl'>Currently no videos available</div>
          )}
        </div>
      </div>
      <div className='pt-6 lg:pt-14 w-full px-10 md:px-0'>
        <PageTitle title='Friendly Game' />
        <div className='mx-0 md:mx-12 lg:mx-20 pb-4 pt-4'>
          <div className='mb-5 w-full pt-10 overflow-x-auto flex gap-6 pb-8'>
            {filteredFriendlyGame.map((video) => {
              return <Video key={video.youtubeId} video={video} type='friendly-game' />;
            })}
            {filteredFriendlyGame.length === 0 && (
              <div className='w-full text-center text-gray-600 text-2xl'>Currently no videos available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameVideos;
