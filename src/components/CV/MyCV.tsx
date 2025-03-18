import React from 'react'
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
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


const MyCV = () => {
    const printPDF = () => {
        const input = document.getElementById('pdf-content'); // Capture the entire body of the page
    
        html2canvas(input, {
          scale: 2, // Higher scale for better image quality
          scrollX: 0,
          scrollY: -window.scrollY, // Adjust scroll position to capture the whole page
          useCORS: true, // Ensure cross-origin images are handled
        }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait orientation
    
          // Get the canvas dimensions
          const pageHeight = pdf.internal.pageSize.height;
          const pageWidth = pdf.internal.pageSize.width;
          
          // Calculate the image height based on the page width
          const imgHeight = (canvas.height * pageWidth) / canvas.width;
          let heightLeft = imgHeight;
    
          // Add the first page with the image
          pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
    
          // If the content exceeds the page, add more pages
          while (heightLeft >= 0) {
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -heightLeft, pageWidth, imgHeight);
            heightLeft -= pageHeight;
          }
    
          // Extract links and add them as clickable annotations
          const links = document.querySelectorAll('a');
          links.forEach((link) => {
            const rect = link.getBoundingClientRect();
            const pageNumber = Math.floor(rect.top / pageHeight) + 1;
            const linkText = link.getAttribute('href');
        //   console.log(linkText);
            // Adjust coordinates based on the page where the link appears
            const x = (rect.left * pageWidth) / canvas.width; // Scale x
            const y = (rect.top * imgHeight) / canvas.height; // Scale y
            
            // If the link is in the first page, we add it there
            // if (pageNumber === 1) {
              pdf.textWithLink(linkText, x, y, { url: linkText });
            // } else {
            //   pdf.addPage();
            //   pdf.textWithLink(linkText, x, y, { url: linkText });
            // }
          });
          // Save the PDF
          pdf.save('fullpage.pdf');
        }).catch((error) => {
          console.error("Error generating PDF:", error);
        });
      };
  return (
    <>
    
    <div className={styles.cv_body} id='pdf-content'>
        <header>
          
            <img src='/image.png' alt="my_image" className={styles.my_image}></img>
            <div className={styles.header_right}>
                <div className={styles.name_container}>
                    <img src='name_img.jpg' className={styles.name_img}/>
                    <h2>Wengang Fei</h2>
                </div>
                <p>Full Stack Web Developer</p>
                <div className={styles.logo_containers}>
                    <FaLocationDot style={{color:'green'}}/> 
                     <span>Boston, MASS,</span>
                     <FcCellPhone />
                     <span>617-369-2866,</span>
                     <MdEmail style={{color:'red'}}/>
                     <span>wengangfei@gmail.com</span>
                </div>
                <div className={styles.logo_containers}>
                    <FaSquareGithub />
                    <a href="https://github.com/WengangFei">
                        https://github.com/WengangFei
                    </a>
                </div>
                <div className={styles.logo_containers}>
                    <CgWebsite style={{color:'orange'}}/>
                    <a href="https://wengangfei.github.io/CV/">
                        https://wengangfei.github.io/CV/
                    </a>
                </div>
                <div className={styles.logo_containers}>
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
                Results-driven Full-Stack Developer with 2+ years of experience designing and implementing scalable, high-performance web applications using modern JavaScript frameworks, including Vue.js, React.js, and Node.js. Proficient in front-end development, creating dynamic and responsive UIs with Vue 3, React 19, and TypeScript, as well as backend optimization, building robust APIs, and integrating databases like PostgreSQL and MongoDB. Experienced in cloud deployment on Google Cloud Platform (GCP), optimizing application performance, and implementing secure authentication (JWT, OAuth).
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
           Designed and launched a highly responsive client dashboard using Vue.js and Tailwind CSS. Improving load times by 40% through code splitting, lazy loading, and efficient state management. <br />
           Architected and maintained a scalable Node.js/Express.js backend, efficiently handling 10,000+ monthly API requests with 99% uptime on Google Cloud Platform (GCP). <br />
           Optimized complex PostgreSQL queries, reducing data retrieval latency by 35% through indexing, query optimization, and connection pooling.<br /> 
           Improved database performance for real-time 3D printing analytics, ensuring seamless processing of large datasets.<br />
           Collaborated with cross-functional teams (engineering, design, and product) to deliver 15+ key features ahead of schedule, including real-time print-status tracking, secure JWT-based authentication, role-based access control, and interactive analytics dashboards, enhancing overall system functionality and user experience.
        </article>
    </div>
    <div>
        <h1>Your Webpage Content</h1>
        <p>This is some text in the page.</p>
        <img src="path_to_your_image.jpg" alt="Sample" />
    </div>
    <button onClick={printPDF}>Download as PDF</button>
    </>
  )
}

export default MyCV