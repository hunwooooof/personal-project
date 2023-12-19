interface PropsType {
  title: string;
}

function PageTitle({ title }: PropsType) {
  return <div className='font-bold text-2xl sm:text-3xl md:ml-12 lg:ml-20 whitespace-nowrap'>{title}</div>;
}

export default PageTitle;
