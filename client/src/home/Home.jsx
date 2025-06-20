import './Home.css';

function Home({fireButtonResponse}) {

  return (
    <div className="home-container">
      <div id="intro">
        <h1>
          WELCOME TO THE GARDEN<br/>OF NOW
        </h1>
        <p>
          Life is full of big questions. Questions like... 'what's for dinner tonight?'.
        </p>
        <p>
          Eating green and supporting local farmers and growers is hard work when you're fresh out of mealtime inspo. Which is where we come in.
        </p>
        <p>
          Click below for recipe ideas tailored to the right here, right now.
        </p>
      </div>
      <div id="recipe-button">
        <button  onClick={fireButtonResponse}>
            TICKLE MY TASTEBUDS
        </button>
      </div>
    </div>
  )
}

export default Home





