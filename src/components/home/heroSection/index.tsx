import { useState } from 'react'
import Header from '../header'
import { Button, Input } from 'antd'
import styles from './herosection.module.css'

const HeroSection = () => {
	const [ email, setEmail ] = useState('')

	return (
		<section className={`section ${styles.section}`}>
			<Header />
			<div className='container'>
				<div className={styles.content}>
					<div className={styles.content_text}>
						<h1 className={styles.heading}>Modern truckload dispatcher</h1>
						<p className={styles.subheading}>
							Trucking loads has never been easier & more convinient.
						</p>
						<form className={styles.form}>
							<Input
								placeholder='Email'
								size='large'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className={styles.input}
							/>
							<Button
								type='primary'
								size='large'
								ghost
								className={styles.button}
							>Book Demo</Button>
						</form>
						<p className={styles.footnote}>
							Coming soon on The App Store & Google Play Store
						</p>
					</div>
					<div className={styles.content_image}>
						<div className={styles.content_image_mockups}>
							<img src='img/phone-map.svg' alt='map on phone' />
							<img src='img/truck.circle.png' alt='driver' />
						</div>
						<img src='img/driver.circle.png' className={styles.pattern_1} alt='Driver on phone'/>
						<img src='img/load.circle.png' className={styles.pattern_2} alt='House'/>
						<img src='img/load.circle.png' className={styles.pattern_3} alt='House'/>
					</div>
				</div>
			</div>
		</section>
	)
}

export default HeroSection