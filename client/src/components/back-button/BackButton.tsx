import './BackButton.css'

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type Props = {
  to?: string
}

export function BackButton({to}: Props) {
  const navigate = useNavigate();

  function handleBack() {
    return to
      ? navigate(to)
      : navigate(-1)
  }

  return (
    <button className='back-button' onClick={handleBack}>
      <ArrowLeft strokeWidth={3} className='back-button__icon' />
      <span className='back-button__text'>&lt; BACK</span>
    </button>
  )
}