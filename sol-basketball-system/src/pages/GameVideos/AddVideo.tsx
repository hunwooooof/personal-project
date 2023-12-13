import { Input, Select, SelectItem } from '@nextui-org/react';
import React, { useState } from 'react';
import PageTitle from '../../components/PageTitle';
import { firestore } from '../../utils/firestore';

interface PropsType {
  getTopLeagueVideos: () => void;
  getFriendlyGameVideos: () => void;
}

interface VideoType {
  tag: string;
  date: string;
  title: string;
  youtubeId: string;
  type?: string;
}

function AddVideo({ getTopLeagueVideos, getFriendlyGameVideos }: PropsType) {
  const [newVideo, setNewVideo] = useState<VideoType>({
    tag: '',
    date: '',
    title: '',
    youtubeId: '',
    type: '',
  });

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

  const types = [
    { label: 'Top League', value: 'top-league' },
    { label: 'Friendly Game', value: 'friendly-game' },
  ];

  const ages = [
    { label: 'U10', value: 'u10' },
    { label: 'U12', value: 'u12' },
  ];

  const inputClass = 'flex flex-wrap md:flex-nowrap gap-4';

  return (
    <div className='pt-6 lg:pt-14 pb-14 border-b border-gray-600 px-10 md:px-0'>
      <PageTitle title='Add Video' />
      <div className='mx-0 md:mx-12 lg:mx-20 flex flex-col md:flex-row py-8 gap-8 lg:gap-16 xl:gap-20'>
        <form
          className='flex flex-col gap-3 font-bold text-black'
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}>
          <div className={`${inputClass} w-[360px] xl:w-[420px]`}>
            <Select
              isRequired
              label='Type'
              className='max-w-md'
              id='type'
              value={newVideo.type}
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
            <div className={`${inputClass} w-[180px] xl:w-[200px]`}>
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
            <div className={`${inputClass} w-[168px] xl:w-[208px]`}>
              <Select
                isRequired
                color='default'
                label='Age'
                className='max-w-md'
                id='tag'
                value={newVideo.tag}
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
          <div className={`${inputClass} w-[360px] xl:w-[420px]`}>
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
          <div className={`${inputClass} w-[360px] xl:w-[420px]`}>
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
            disabled={Object.values(newVideo).some((item) => item.length === 0) || newVideo.youtubeId.length !== 11}
            type='submit'>
            Add Video
          </button>
        </form>
        <div className='w-[350px] lg:w-[400px] flex-shrink-0 bg-gray-100 rounded-xl' id='video-demonstrate'>
          <iframe
            src={`https://www.youtube.com/embed/${newVideo.youtubeId}`}
            title='YouTube video player'
            className='w-full h-[200px] lg:h-[250px] rounded-t-xl'
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
  );
}

export default AddVideo;
