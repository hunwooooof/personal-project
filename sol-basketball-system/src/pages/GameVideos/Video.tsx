import toast from 'react-hot-toast';
import { useStore } from '../../store/store';
import { firestore } from '../../utils/firestore';
import { VideoType } from '../../utils/types';

interface PropsType {
  video: {
    tag: string;
    date: string;
    title: string;
    youtubeId: string;
  };
  type: string;
}

function Video({ video, type }: PropsType) {
  const { user } = useStore();

  const handleDelete = (video: VideoType, type: string) => {
    const userConfirm = confirm('Are you sure you want to delete this video?');
    if (userConfirm) {
      firestore
        .deleteDoc('videos', 'roadrunners', type, video.youtubeId)
        .then(() => {
          toast.success('Deletion successful');
        })
        .catch((error) => {
          console.log(error);
          toast.error('Deletion failed');
        });
    }
  };

  return (
    <div className='flex-shrink-0 w-[400px] bg-gray-100 rounded-xl'>
      <iframe
        src={`https://www.youtube.com/embed/${video.youtubeId}`}
        title='YouTube video player'
        className='w-full h-[250px] rounded-t-xl'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      />
      <div className='flex flex-col px-4 gap-3 mt-3 pb-4 text-black'>
        <div className='flex justify-between items-center'>
          <div className='tracking-wider'>{video.date}</div>
          <div className='px-2 h-[26px] border border-gray-600 rounded-full'>{video.tag === 'u10' ? 'U10' : 'U12'}</div>
        </div>
        <div className='flex justify-between items-center'>
          <div className='font-bold w-72'>{video.title}</div>
          {user.role === 'admin' && (
            <button className='text-gray-400 hover:text-red-500' onClick={() => handleDelete(video, type)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Video;
