import { Input, Select, SelectItem } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
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
    date: '2023-01-01',
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
    setNewVideo({ ...newVideo, [id]: e.target.value });
  };

  const handleSubmit = () => {
    const { tag, date, title, youtubeId, type } = newVideo;
    firestore
      .setDoc(
        'videos',
        'roadrunners',
        { tag, date, title: title.trim(), youtubeId: youtubeId.trim() },
        `${newVideo.type}`,
        newVideo.youtubeId,
      )
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

  const ages = [
    { label: 'U10', value: 'u10' },
    { label: 'U12', value: 'u12' },
  ];
  const types = [
    { label: 'Top League', value: 'top-league' },
    { label: 'Friendly Game', value: 'friendly-game' },
  ];
  const filterTag = [
    { value: 'all', label: 'All' },
    { value: 'u10', label: 'U10' },
    { value: 'u12', label: 'U12' },
  ];

  const inputClass = 'flex flex-wrap md:flex-nowrap gap-4';

  return (
    <div className='custom-main-container'>
      {user.role === 'admin' && (
        <div className='pt-6 lg:pt-14 pb-14 border-b border-gray-600'>
          <PageTitle title='Add Video' />
          <div className='mx-0 md:mx-12 lg:mx-20 flex items-center py-8'>
            <div className='flex flex-col gap-3 font-bold text-black'>
              <div className={`${inputClass} w-[420px]`}>
                <Select
                  isRequired
                  label='Type'
                  className='max-w-md'
                  id='type'
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewVideo({
                      ...newVideo,
                      type: value,
                    });
                  }}>
                  {types.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className='flex gap-3'>
                <div className={`${inputClass} w-[200px]`}>
                  <Input
                    isRequired
                    type='date'
                    id='date'
                    label='Date'
                    placeholder='2023-11-11'
                    value={newVideo.date}
                    onChange={handleChangeInput}
                  />
                </div>
                <div className={`${inputClass} w-[208px]`}>
                  <Select
                    isRequired
                    color='default'
                    label='Age'
                    className='max-w-md'
                    id='tag'
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewVideo({
                        ...newVideo,
                        tag: value,
                      });
                    }}>
                    {ages.map((age) => (
                      <SelectItem key={age.value} value={age.value}>
                        {age.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div className={`${inputClass} w-[420px]`}>
                <Input
                  isRequired
                  type='text'
                  className='max-w-md'
                  id='youtubeId'
                  label=' YouTube Video ID'
                  placeholder='07NkJZ2N94M'
                  value={newVideo.youtubeId}
                  onChange={handleChangeInput}
                  startContent={
                    <div className='pointer-events-none flex items-center'>
                      <span className='text-default-400 font-normal text-xs w-[202px]'>
                        https://www.youtube.com/watch?v=
                      </span>
                    </div>
                  }
                />
              </div>
              <div className={`${inputClass} w-[420px]`}>
                <Input
                  isRequired
                  type='text'
                  className='max-w-md'
                  id='title'
                  label='Title'
                  placeholder='Roadrunners vs TOP'
                  value={newVideo.title}
                  onChange={handleChangeInput}
                />
              </div>
              <button
                className='w-32 font-semibold rounded-full bg-gray-700 text-white mt-4 py-2 hover:scale-110 duration-150 disabled:scale-100 disabled:cursor-auto disabled:text-gray-600'
                onClick={handleSubmit}
                disabled={Object.values(newVideo).some((item) => item.length === 0) || newVideo.youtubeId.length !== 11}
                type='submit'>
                Add Video
              </button>
            </div>
            <div className='w-[400px] flex-shrink-0 bg-gray-100 rounded-xl ml-20' id='video-demonstrate'>
              <iframe
                src={`https://www.youtube.com/embed/${newVideo.youtubeId}`}
                title='YouTube video player'
                className='w-full h-[250px] rounded-t-xl'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              />
              <div className='flex flex-col px-4 gap-3 mt-3 pb-4 text-black'>
                <div className='flex justify-between items-center'>
                  <div className='tracking-wider'>{newVideo.date}</div>
                  <div className='ml-auto mr-1 px-2 h-[26px] border border-gray-600 rounded-full'>
                    {newVideo.type === 'top-league'
                      ? 'Top League'
                      : newVideo.type === 'friendly-game'
                        ? 'Friendly Game'
                        : 'Please select game type'}
                  </div>
                  <div className='px-2 h-[26px] border border-gray-600 rounded-full'>
                    {newVideo.tag === 'u10' ? 'U10' : newVideo.tag === 'u12' ? 'U12' : 'U'}
                  </div>
                </div>
                <div className='font-bold w-72'>{newVideo.title}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='pt-6 lg:pt-14 w-full flex justify-between items-center'>
        <PageTitle title='Top League' />
        <div className=' mr-0 md:mr-12 lg:mr-20 flex w-20 flex-wrap md:flex-nowrap gap-4 text-black'>
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
      <div className='w-full pt-10 pb-4 border-b border-gray-600'>
        <div className='mx-0 md:mx-12 lg:mx-20 overflow-x-auto flex gap-6 pb-4 mb-8'>
          {filteredTopLeague.map((video) => {
            return <Video key={video.youtubeId} video={video} type='top-league' getVideo={getTopLeagueVideos} />;
          })}
          {filteredTopLeague.length === 0 && (
            <div className='w-full text-center text-gray-600 text-2xl'>Currently no videos available</div>
          )}
        </div>
      </div>
      <div className='pt-6 lg:pt-14 w-full'>
        <PageTitle title='Friendly Game' />
      </div>
      <div className='mx-0 md:mx-12 lg:mx-20 pb-4 mb-8 pt-4'>
        <div className='mb-5 w-full pt-10 overflow-x-auto flex gap-6 pb-8'>
          {filteredFriendlyGame.map((video) => {
            return <Video key={video.youtubeId} video={video} type='friendly-game' getVideo={getFriendlyGameVideos} />;
          })}
          {filteredFriendlyGame.length === 0 && (
            <div className='w-full text-center text-gray-600 text-2xl'>Currently no videos available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameVideos;
