import styles from './featureSection.module.css'

const FeatureSection = () => {
	return (
		<section className={`section ${styles.section}`}>
			<div className='container'>
				<h1 className={styles.heading}>What we are proud of doing</h1>
				<div className={styles.content}>
					<div className={styles.content_group}>
						<img
							src='img/ready_now.gif'
							alt='Ready now'
							className={styles.content_group_image_1}
						/>
						<div className={styles.content_group_1_text}>
							<h1 className={styles.content_group_heading}>
								1. Ready now
							</h1>
							<p className={styles.content_group_subheading}>
                             Set the times when you will be ready
							</p>
						</div>
					</div>
					<div className={styles.content_group}>
						<div className={styles.content_group_2_text}>
							<h1 className={styles.content_group_heading}>
                            2. select destinations
							</h1>
							<p className={styles.content_group_subheading}>
                            select the markets you want to go to, avoid bad markets via NO-GO map.
							</p>
						</div>
						<img
							src='img/selection.gif'
							alt='screenshot of app homepage'
							className={styles.content_group_image_2}
						/>
					</div>
                    <div className={styles.content_group}>
						<img
							src='img/recommentation.gif'
							alt='Recommentation'
							className={styles.content_group_image_1}
						/>
						<div className={styles.content_group_1_text}>
							<h1 className={styles.content_group_heading}>
                            3. spotter recommends loads
							</h1>
							<p className={styles.content_group_subheading}>
                            get matched with the highest load score offers
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default FeatureSection