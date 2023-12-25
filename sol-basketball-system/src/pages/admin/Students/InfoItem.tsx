interface PropsType {
  label: string;
  value: string | number;
}

function InfoItem({ label, value }: PropsType) {
  const infoLabelClass = 'inline-block w-4/12 mr-2 text-gray-500';
  const infoContainerClass = 'w-full flex items-center mb-2 text-black justify-start gap-2';

  return (
    <div className={infoContainerClass}>
      <span className={infoLabelClass}>{label}</span>
      {value}
    </div>
  );
}

export default InfoItem;
