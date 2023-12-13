import { Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import LoadingAnimation from '../../components/LoadingAnimation';
import PageTitle from '../../components/PageTitle';
import { useStore } from '../../store/store';
import { firestore } from '../../utils/firestore';
import AddVideo from './AddVideo';
import Video from './Video';
interface VideoType {
  tag: string;
  date: string;
  title: string;
  youtubeId: string;
  type?: string;
}
function GameVideos() {
  const { user, isLoading, setLoading, setCurrentNav } = useStore();
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
    if (topLeague.length === 0 && friendlyGame.length === 0) {
      getTopLeagueVideos();
      getFriendlyGameVideos().then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  const filterTag = [
    { value: 'all', label: 'All' },
    { value: 'u10', label: 'U10' },
    { value: 'u12', label: 'U12' },
  ];

  return (
    <div className='custom-main-container'>
      {isLoading && <LoadingAnimation />}
      {user.role === 'admin' && (
        <AddVideo getTopLeagueVideos={getTopLeagueVideos} getFriendlyGameVideos={getFriendlyGameVideos} />
      )}
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
            return <Video key={video.youtubeId} video={video} type='top-league' getVideo={getTopLeagueVideos} />;
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
              return (
                <Video key={video.youtubeId} video={video} type='friendly-game' getVideo={getFriendlyGameVideos} />
              );
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
