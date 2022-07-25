import React from "react";
import rosa from './rosa2.png'; // Tell webpack this JS file uses this image

export default class Brush extends React.Component {
    constructor(props) {
        super(props);
        this.state = { x: 0, y: 0 };
      }
    
      _onMouseMove(e) {
        this.setState({ x: e.screenX, y: e.screenY });
      }
    
      render() {
        const { x, y } = this.state;
        return <div onMouseMove={this._onMouseMove.bind(this)}>
          <h1>Mouse coordinates: { x } { y }</h1>
          <img src={rosa} alt="Logo" 
          style={{width: 200, height: 200, position: 'fixed', top: x, left: y}}/>
          
        </div>;
      }
}