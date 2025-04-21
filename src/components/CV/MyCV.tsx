
import styles from './MyCV.module.css'
import { FaLocationDot } from "react-icons/fa6";
import { FcCellPhone } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import { CgWebsite } from "react-icons/cg";
import { FaNewspaper } from "react-icons/fa";
import { RiGraduationCapFill } from "react-icons/ri";
import { GrPersonalComputer } from "react-icons/gr";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import html2pdf from 'html2pdf.js';


const MyCV = () => {
    const printPDF = () => {
        const element = document.getElementById('pdf-content');
    
        const opt = {
            margin: 0,
            filename: 'MyCV.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
              scale: 2, // 5 is too high and may introduce inconsistencies
              useCORS: true,
              allowTaint: false,
              scrollX: 0,
              scrollY: 0,
              windowWidth: document.getElementById('pdf-content').scrollWidth,
              windowHeight: document.getElementById('pdf-content').scrollHeight
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, // Use standard A4
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
          };
          
          
    
        html2pdf().set(opt).from(element).save();
      };
    
  return (
    <>
    
    <div className={`${styles.cv_body} pdf-wrapper`} id='pdf-content'>
        <header>
          
            <img src='/image.png' alt="my_image" className={styles.my_image}></img>
            <div className={styles.header_right}>
                <div className={styles.name_container}>
                    <img src='name_img.jpg' className={styles.name_img}/>
                    <h3>Wengang Fei</h3>
                </div>
                <p>Full Stack Web Developer</p>
                <div className={styles.logo_info}>
                    <FaLocationDot style={{color:'green'}}/> 
                     <span>Boston, MASS,</span>
                     <FcCellPhone />
                     <span>617-369-2866,</span>
                     <MdEmail style={{color:'red'}}/>
                     <span>wengangfei@gmail.com</span>
                </div>
                <div className={styles.logo_links}>
                    <CgWebsite style={{color:'orange'}}/>
                    <a href="https://wengangfei.github.io/CV/">
                        https://wengangfei.github.io/CV/
                    </a>
                </div>
                <div className={styles.logo_links}>
                    <FaSquareGithub />
                    <a href="https://github.com/WengangFei">
                        Github.com/WengangFei
                    </a>
                </div>
                <div className={styles.logo_links}>
                    <FaLinkedin style={{color:'blue'}}/>
                    <a href="https://www.linkedin.com/in/wen-fei-61296032a/">
                    https://www.linkedin.com/in/wen-fei-61296032a/
                    </a>
                </div>
            </div>
        </header>
        <p className={styles.line_title}>Summary <FaNewspaper style={{color:'black'}}/></p>
        <hr />
        <article>
                Results-driven Full-Stack Developer with 3+ years of experience designing and implementing scalable, high-performance web applications using modern JavaScript frameworks, including Vue.js, React.js, and Node.js. Proficient in front-end development, creating dynamic and responsive UIs with Vue 3, React 19, and TypeScript, as well as backend optimization, building robust APIs, and integrating databases like PostgreSQL and MongoDB. Experienced in cloud deployment on Google Cloud Platform (GCP), optimizing application performance, and implementing secure authentication (JWT, OAuth).
        </article>
        <p className={styles.line_title}>Education <RiGraduationCapFill style={{color:'black'}}/></p>
        <hr />
        <article>
            <h4 className={styles.education_h5}>Boston University</h4>
            <h5 className={styles.education_h5}>Bachelor of Science in Computer Science </h5>
            <h5 className={styles.education_h5}>09/2020 – 01/2024</h5>
            <h5> GPA: 3.6/4</h5>
            At Boston University, I gained in-depth knowledge and practical skills for a career as a full-stack web developer, covering key topics like algorithms, database systems, cloud computing, and software engineering.<br />

            Relevant Coursework:<br />

            Algorithms: Learned algorithm design, analysis, and optimization for web applications.<br />
            Database Systems: Mastered MySQL, PostgreSQL, and SQL queries for efficient data management.
            Cloud Computing: Gained hands-on experience with AWS and Azure for cloud-based web app deployment.<br />
            Software Engineering: Worked through the full software development lifecycle using Agile and Scrum methodologies.<br />
            Web Development: Built responsive, dynamic web pages with HTML, CSS, JavaScript, and optimized for performance.<br />
            Operating Systems: Studied system processes, memory, and file management for optimizing web app performance.
        </article>
        <p className={styles.line_title}>Skills <GrPersonalComputer style={{color:'black'}}/></p>
        <hr />
        <article>
            <p className={styles.skills_title}>Frontend</p>
            <div className={styles.skills}>
                <p>HTML <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar /></p>
                <p>CSS <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar /></p>
                <p>JavaScript <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar /></p>
                <p>Vue.js <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar /></p>
                <p>React.js <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar /></p>
            </div>
            <p className={styles.skills_title}>Backend</p>
            <div className={styles.skills}>
                <p>Node.js <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar /></p>
                <p>Express.js <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar /></p>
                <p>MongoDB <FaStar /><FaStar /><FaStar /><FaRegStar /><FaRegStar /></p>
                <p>PostgreSQL <FaStar /><FaStar /><FaStar /><FaStar /><FaRegStar /></p>
            </div>
            <p className={styles.skills_title}>Cloud</p>
            <div className={styles.skills}>
                <p>Google Cloud <FaStar /><FaStar /><FaStar /><FaRegStar /><FaRegStar /></p>
                </div>
        </article>
        <p className={styles.line_title}>Experience <GrUserWorker style={{color:'black'}}/></p>
        <hr />
        <article>
           <h3>3D Fortify</h3> 
           <h5 className={styles.work_h5}>09/2022 – 04/2025</h5>
           Designed and launched a highly responsive client dashboard using Vue.js and Tailwind CSS. Improving load times by 40% through code splitting, lazy loading, and efficient state management. <br />
           Architected and maintained a scalable Node.js/Express.js backend, efficiently handling 10,000+ monthly API requests with 99% uptime on Google Cloud Platform (GCP). <br />
           Optimized complex PostgreSQL queries, reducing data retrieval latency by 35% through indexing, query optimization, and connection pooling.<br /> 
           Improved database performance for real-time 3D printing analytics, ensuring seamless processing of large datasets.<br />
           Collaborated with cross-functional teams (engineering, design, and product) to deliver 15+ key features ahead of schedule, including real-time print-status tracking, secure JWT-based authentication, role-based access control, and interactive analytics dashboards, enhancing overall system functionality and user experience.
        </article>
    </div>
    <button onClick={printPDF} style={{ marginTop: '20px' }}>Download as PDF</button>
    </>
  )
}

export default MyCV