import { Button } from 'antd'
import styles from './header.module.css'
import Logo from '../../logo'

const Header = () => {
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
					>Login</Button>
                    <span style={{paddingLeft: "20px"}}/>
                    <Button
						type='default'
						size='large'
                        className='default-btn'
					>Sign in</Button>
                    </div>
				</div>
			</div>
		</header>
	)
}

export default Header