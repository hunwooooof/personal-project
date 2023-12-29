import { Input, Select, SelectItem } from '@nextui-org/react';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';
import { firestore } from '../../utils/firestore';
import { extractVideoId } from '../../utils/helpers';
import { NewVideoType } from '../../utils/types';
import VideoDemoCard from './VideoDemoCard';

function AddVideo() {
  const selectBox = useRef(null);
  const [newVideo, setNewVideo] = useState<NewVideoType>({
    tag: '',
    date: '',
    title: '',
    youtubeLink: '',
    type: '',
  });

  const types = [
    { label: 'Top League', value: 'top-league' },
    { label: 'Friendly Game', value: 'friendly-game' },
  ];

  const ages = [
    { label: 'U10', value: 'u10' },
    { label: 'U12', value: 'u12' },
  ];

  const inputClass = 'flex flex-wrap md:flex-nowrap gap-4';

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id;
    setNewVideo({ ...newVideo, [id]: e.target.value });
  };

  const youtubeId = extractVideoId(newVideo.youtubeLink.trim());

  const handleSubmit = () => {
    const { tag, date, title } = newVideo;
    firestore
      .setDoc(
        'videos',
        'roadrunners',
        { tag, date, title: title.trim(), youtubeId: youtubeId },
        `${newVideo.type}`,
        youtubeId as string,
      )
      .then(() => {
        toast.success('Video upload successful');
      })
      .catch(() => {
        toast.error('Upload failed.');
      });
    setNewVideo({
      tag: '',
      date: '',
      title: '',
      youtubeLink: '',
      type: '',
    });
    selectBox.current = null;
  };

  const isVideoTitleTooLong = newVideo.title.length > 40;
  const hasEmptyValues = Object.values(newVideo).some((item) => item.length === 0);

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
          <div className={`${inputClass} max-w-[360px] sm:max-w-none sm:w-[360px] xl:w-[420px]`}>
            <Select
              ref={selectBox}
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
            <div className={`${inputClass} w-[180px] xl:w-[200px]`}>
              <Input
                isRequired
                type='date'
                id='date'
                label='Date'
                placeholder='0'
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
          <div className={`${inputClass} max-w-[360px] sm:max-w-none sm:w-[360px] xl:w-[420px]`}>
            <Input
              isRequired
              type='text'
              className='max-w-md'
              id='youtubeLink'
              label='YouTube Video Link'
              placeholder='https://www.youtube.com/watch?v=Iqs4n-2UWvo'
              value={newVideo.youtubeLink}
              onChange={handleChangeInput}
            />
          </div>
          <div className={`${inputClass} max-w-[360px] sm:max-w-none sm:w-[360px] xl:w-[420px]`}>
            <Input
              isRequired
              type='text'
              className='max-w-md'
              id='title'
              label='Title'
              placeholder='Roadrunners vs TOP'
              isInvalid={isVideoTitleTooLong}
              color={isVideoTitleTooLong ? 'danger' : 'default'}
              errorMessage={isVideoTitleTooLong && 'Exceeds the maximum character limit.'}
              value={newVideo.title}
              onChange={handleChangeInput}
            />
          </div>
          <button
            className='flex items-center max-w-[360px] sm:w-[360px] justify-center font-semibold rounded-full bg-gray-700 text-white mt-4 py-2 hover:scale-110 duration-150 disabled:scale-100 disabled:cursor-auto disabled:text-gray-600'
            disabled={hasEmptyValues || isVideoTitleTooLong}
            type='submit'>
            Add Video
          </button>
        </form>
        <VideoDemoCard newVideo={newVideo} />
      </div>
    </div>
  );
}

export default AddVideo;
