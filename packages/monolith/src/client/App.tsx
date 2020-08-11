// import { Col, Container, Row } from "react-bootstrap";
import MyNavbar from "./MyNavbar";
// import MyRouter from "./MyRouter";
import React from "react";

export default function App(): JSX.Element {
  return (
    <React.StrictMode>
      <MyNavbar />
    </React.StrictMode>
  );
}

// export default function App(): JSX.Element {
//   return (
//     <Container>
//       <MyNavbar />
//       <Row>
//         <Col>
//           <p>
//             The smartest way to <br />
//             train your team and <br />
//             partner agents
//           </p>
//           <p>
//             Panda provides agents with
//             <span>one powerful platform</span> to access all the sales
//             trainings, marketing materials, admissions procedures and policies
//             of
//             <span>all the participating schools they represent.</span>
//           </p>
//           <form
//             action="https://pandaportal.co/index.php/register"
//             method="post"
//           >
//             <input
//               type="hidden"
//               name="_token"
//               value="xtI4s0Xq2I2ZqP2ESa35yxs3jQX7eNCbpUO40kLx"
//             />
//             <div>
//               <input
//                 type="email"
//                 placeholder="Write your E-mail"
//                 name="email"
//                 id="email"
//                 required
//               />
//             </div>
//             <div>
//               <button type="submit">GET STARTED FOR FREE</button>
//             </div>
//           </form>
//         </Col>
//         <Col>
//           <img
//             src="https://pandaportal.co/assets/images/frontend/web.png"
//             alt=""
//           />

//           <iframe
//             src="https://player.vimeo.com/video/427895932?color=EED429&amp;byline=0&amp;portrait=0"
//             width="640"
//             height="360"
//             frameBorder="0"
//             allow="autoplay; fullscreen"
//             id="panda-iframe-video-home"
//             title="vimeo"
//           ></iframe>
//         </Col>
//       </Row>
//     </Container>
//   );
// }
