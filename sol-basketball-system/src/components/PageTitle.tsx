interface PropsType {
  title: string;
}

function PageTitle({ title }: PropsType) {
  return <div className='font-bold text-2xl sm:text-3xl ml-0 md:ml-12 lg:ml-20'>{title}</div>;
}

export default PageTitle;
