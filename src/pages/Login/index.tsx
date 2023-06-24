import LoginGif from "../../assets/signfeed_logo.gif";
function LogIn() {
  return (
    <div className="LoginPage">
      <div className="MainContainer">
        <div className="ImageContainer">
          <img src={LoginGif} alt="Logo" className="logo" />
        </div>
        <div className="MainFoam">
          <div className="InputGrup">
            <label className="Inputlable" htmlFor="URLInput">
              URL
            </label>
            <input id="URLInput" type="text" placeholder="URL" />
          </div>
          <div className="InputGrup">
            <label className="Inputlable" htmlFor="ServerInput">
              Server Key
            </label>
            <input
              className="ServerKey"
              type="text"
              id="ServerInput"
              placeholder="Server Key"
            />
          </div>
          <button className="RegisterButton" type="submit">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
