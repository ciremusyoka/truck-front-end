import { Button } from 'antd'
import styles from './header.module.css'
import Logo from '../../logo'
import { useNavigate } from 'react-router-dom';
import { LOGIN_LINK, SIGN_IN_LINK } from '../../../utils/constants';

const Header = () => {
    const navigate = useNavigate();
    
	return (
		<header>
			<div className='container'>
				<div className={styles.content}>
					<Logo />
					<div>
                        <Button
						type='default'
						size='large'
                        className='default-btn'
                        onClick={() => navigate(LOGIN_LINK)}
					>Login</Button>
                    <span style={{paddingLeft: "20px"}}/>
                    <Button
						type='default'
						size='large'
                        className='default-btn'
                        onClick={() => navigate(SIGN_IN_LINK)}
					>Sign in</Button>
                    </div>
				</div>
			</div>
		</header>
	)
}

export default Header