import { extractVideoId } from '../../utils/helpers';
import { NewVideoType } from '../../utils/types';

interface PropsType {
  newVideo: NewVideoType;
}

function VideoDemoCard({ newVideo }: PropsType) {
  const videoId = extractVideoId(newVideo.youtubeLink.trim());
  const gameTypeDisplay =
    newVideo.type === 'top-league'
      ? 'Top League'
      : newVideo.type === 'friendly-game'
        ? 'Friendly Game'
        : 'Please select game type';

  const tagDisplay = newVideo.tag === 'u10' ? 'U10' : newVideo.tag === 'u12' ? 'U12' : 'U?';

  return (
    <div
      className='max-w-[350px] xl:max-w-none lg:w-[400px] flex-shrink-0 bg-gray-100 rounded-xl'
      id='video-demonstrate'>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title='YouTube video player'
        className='w-full h-[200px] lg:h-[250px] rounded-t-xl'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      />
      <div className='flex flex-col px-4 gap-3 mt-3 pb-4 text-black'>
        <div className='flex justify-between items-center'>
          <div className='text-sm xl:text-base tracking-wider'>{newVideo.date}</div>
          <div className='text-sm xl:text-base ml-auto mr-1 px-2 h-[26px] border border-gray-600 rounded-full'>
            {gameTypeDisplay}
          </div>
          <div className='text-sm xl:text-base px-2 h-[26px] border border-gray-600 rounded-full'>{tagDisplay}</div>
        </div>
        <div className='text-sm xl:text-base font-bold w-72'>{newVideo.title}</div>
      </div>
    </div>
  );
}

export default VideoDemoCard;
