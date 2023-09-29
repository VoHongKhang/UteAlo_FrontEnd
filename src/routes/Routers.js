import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from '../components/home/Home';
import Login from '../components/login/Login';
import Register from '../components/register/Register';
import Profile from '../components/profile/Profile';
import FriendRequest from '../components/friend/friendRequest/FriendRequest';
import FriendList from '../components/friend/friendlist/FriendList';
import Chat from '../components/chat/Chat';
import NotFound from '../components/notfound/NotFound';

const Routers = () => {
    
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/profile" component={Profile}/>
                <Route path="/friend-request" component={FriendRequest}/>
                <Route path="/friend-list" component={FriendList}/>
                <Route path="/chat" component={Chat}/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    );
};

export default Routers;
