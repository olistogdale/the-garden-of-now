import './BackButton.css'

import { useNavigate } from 'react-router-dom'

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
      &lt; BACK
    </button>
  )
}