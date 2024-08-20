import { createBrowserRouter } from 'react-router-dom'
import { BackGround } from '../components/background/BackGround'
import { LandingPage } from '../pages/LandingPage'
import { GameBackGround } from '../components/background/GameBackGround'
import { GamePage } from '../pages/GamePage'

const Routes = createBrowserRouter([
  {
    path:"/",
    element:<BackGround />,
    children: [
      {
        path:"/",
        element:<LandingPage />
      }
    ]
  },
  {
    path:"/:name/:roomId",
    element:<GameBackGround />,
    children:[
      {
        path:"",
        element:<GamePage />
      }
    ]
  }
])
export default Routes
