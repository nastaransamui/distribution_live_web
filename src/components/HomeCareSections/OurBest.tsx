// @ts-nocheck
/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Slider from "react-slick";
import Link from 'next/link';
import {
  video_slider_img_01,
  video_slider_img_02,
  video_slider_img_03,
  video_slider_img_04,
  video_slider_img_01_scale,
  video_slider_img_02_scale,
  video_slider_img_03_scale,
  video_slider_img_04_scale,
} from '@/public/assets/imagepath'
import { useTheme } from "@mui/material";

const OurBest: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme()
  const [nav1, setNav1] = useState<any>();
  const [nav2, setNav2] = useState<any>();
  const slider1 = useRef<any>(null);
  const slider2 = useRef<any>(null);


  useEffect(() => {
    if (slider1.current && slider2.current) {
      setNav1(slider1.current);
      setNav2(slider2.current);
    }
  }, []);



  const [isPlaying0, setIsPlaying0] = useState(false);
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isPlaying3, setIsPlaying3] = useState(false);
  const togglePlayback0 = (e: React.MouseEvent) => {
    e.preventDefault();
    const videoElement = document.getElementById(`vid_0`) as HTMLVideoElement | null;
    if (videoElement) {
      if (isPlaying0) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
    setIsPlaying0(!isPlaying0);

  };
  const togglePlayback1 = (e: React.MouseEvent) => {
    e.preventDefault();
    const videoElement = document.getElementById(`vid_1`) as HTMLVideoElement | null;
    if (videoElement) {
      if (isPlaying1) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
    setIsPlaying1(!isPlaying1);

  };

  const togglePlayback2 = (e: React.MouseEvent) => {
    e.preventDefault();
    const videoElement = document.getElementById(`vid_2`) as HTMLVideoElement | null;
    if (videoElement) {
      if (isPlaying2) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
    setIsPlaying2(!isPlaying2);

  };
  const togglePlayback3 = (e: React.MouseEvent) => {
    e.preventDefault();
    const videoElement = document.getElementById(`vid_3`) as HTMLVideoElement | null;
    if (videoElement) {
      if (isPlaying3) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
    setIsPlaying3(!isPlaying3);

  };
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({});

  const togglePlayback = (index: number) => {
    const videoElement = document.getElementById(`vid_${index}`) as HTMLVideoElement | null;
    if (videoElement) {
      if (isPlaying[index]) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
    setIsPlaying((prev) => ({ ...prev, [index]: !prev[index] }));

  };

  return (
    <section className="our-best-work-sec" style={{
      ...muiVar,
      backgroundImage: `url(/assets/images/bg/video-sec-bg_${theme.palette.secondary.main.slice(1)}.webp)`
    }}>
      <div className="container">
        <div className="section-head-fourteen" data-aos="fade-down">
          <h2>See Our Best Work</h2>
          <p>More the quantity, higher the discount. Hurry, Buy Now!</p>
        </div>
        <div className="treatment-video-main">
          <div className="row">
            <div className="col-lg-12">
              <div className="best-work-video" data-aos="fade-up">
                <Slider
                  className="slider work-video-img"
                  asNavFor={nav2}
                  ref={slider1}
                  lazyLoad="ondemand"
                  infinite={true}
                >
                  {[video_slider_img_01, video_slider_img_02, video_slider_img_03, video_slider_img_04].map(
                    (image, index) => {
                      return (
                        <div key={index}>
                          <div className="treatment-video" >
                            <div className="video-img">
                              <img src={image} alt="Slider" />
                              <div className={`container video-container ${isPlaying[index] ? 'video-container-active' : ''}`} >
                                <video id={`vid_${index}`} className={`new-video-player`}
                                  autoPlay={index == 3}
                                  loop
                                  muted
                                >
                                  <source
                                    src="https://media.istockphoto.com/id/1026837780/video/female-doctor-discusses-diagnosis-with-senior-male-patient.mp4?s=mp4-640x640-is&k=20&c=xuEa4-MNFJQTG0rsrImvNp_JSes0bA-ugZEFFVRse9Q="
                                    type="video/mp4"
                                  />
                                  <track src="descriptions.vtt" kind="captions" srcLang="en" label="English" />
                                </video>
                              </div>
                            </div>
                            <Link href="" aria-label='play button' className={`play-achor_0 ${isPlaying[index] ? 'active' : ''}`} onClick={(e) => {
                              e.preventDefault();
                              togglePlayback(index)
                            }}>
                              <span className="play-btn-video">
                                <i className="fa-solid fa-play"></i>
                              </span>
                              <span className="pause-btn-video">
                                <i className="fa-solid fa-pause"></i>
                              </span>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  {/* <div>
                    <div className="treatment-video">
                      <div className="video-img">
                        <img src={video_slider_img_01} alt="Slider" />
                        <div className="" style={{ background: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute, }}>
                          <video id="vid_0" className={`${isPlaying0 ? 'active' : ''}`} loop >
                            <source
                              src="https://media.istockphoto.com/id/1026837780/video/female-doctor-discusses-diagnosis-with-senior-male-patient.mp4?s=mp4-640x640-is&k=20&c=xuEa4-MNFJQTG0rsrImvNp_JSes0bA-ugZEFFVRse9Q="
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      </div>
                      <Link href="" aria-label='play button' className={`play-achor_0 ${isPlaying0 ? 'active' : ''}`} onClick={togglePlayback0}>
                        <span className="play-btn-video">
                          <i className="fa-solid fa-play"></i>
                        </span>
                        <span className="pause-btn-video">
                          <i className="fa-solid fa-pause"></i>
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <div className="treatment-video">
                      <div className="video-img">
                        <img src={video_slider_img_02} alt="Slider" />
                        <div className="" style={{ background: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute, }}>

                          <video id="vid_1" className={`${isPlaying1 ? 'active' : ''}`} loop >

                            <source
                              src="https://media.istockphoto.com/id/1026837780/video/female-doctor-discusses-diagnosis-with-senior-male-patient.mp4?s=mp4-640x640-is&k=20&c=xuEa4-MNFJQTG0rsrImvNp_JSes0bA-ugZEFFVRse9Q="
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      </div>
                      <Link href="" aria-label='play button' className={`play-achor_1 ${isPlaying1 ? 'active' : ''}`} onClick={togglePlayback1}>
                        <span className="play-btn-video">
                          <i className="fa-solid fa-play"></i>
                        </span>
                        <span className="pause-btn-video">
                          <i className="fa-solid fa-pause"></i>
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <div className="treatment-video">
                      <div className="video-img">
                        <img src={video_slider_img_03} alt="Slider" />
                        <div className="" style={{ background: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                          <video id="vid_2" className={`${isPlaying2 ? 'active' : ''}`} loop >
                            <source
                              src="https://media.istockphoto.com/id/1026837780/video/female-doctor-discusses-diagnosis-with-senior-male-patient.mp4?s=mp4-640x640-is&k=20&c=xuEa4-MNFJQTG0rsrImvNp_JSes0bA-ugZEFFVRse9Q="
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      </div>
                      <Link href="" aria-label='play button' className={`play-achor_2  ${isPlaying2 ? 'active' : ''}`} onClick={togglePlayback2}>
                        <span className="play-btn-video">
                          <i className="fa-solid fa-play"></i>
                        </span>
                        <span className="pause-btn-video">
                          <i className="fa-solid fa-pause"></i>
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <div className="treatment-video">
                      <div className="video-img">
                        <img src={video_slider_img_04} alt="Slider" />
                        <div className="" style={{ background: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                          <video id="vid_3" className={`${isPlaying3 ? 'active' : ''}`} loop >
                            <source
                              src="https://media.istockphoto.com/id/2002908406/th/%E0%B8%A7%E0%B8%B4%E0%B8%94%E0%B8%B5%E0%B9%82%E0%B8%AD/abstract-underwater-bubbles.mp4?s=mp4-640x640-is&k=20&c=rEBl-Hck7KxxQ8RvIRJA62PMTPSAQfRurvErOwp40QE="
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      </div>
                      <Link href="" aria-label='play button' className={`play-achor_3  ${isPlaying3 ? 'active' : ''}`} onClick={togglePlayback3}>
                        <span className="play-btn-video">
                          <i className="fa-solid fa-play"></i>
                        </span>
                        <span className="pause-btn-video">
                          <i className="fa-solid fa-pause"></i>
                        </span>
                      </Link>
                    </div>
                  </div> */}
                </Slider>

                <Slider
                  asNavFor={nav1}
                  ref={slider2}
                  slidesToShow={3}
                  slidesToScroll={1}
                  arrows={false}
                  swipeToSlide={false}
                  focusOnSelect={true}
                  className=" slider slider-thumbnails-img "
                  data-aos="fade-up"
                >
                  <div className="slider-small-thumb">
                    <div className="small-slide-img">
                      <img src={video_slider_img_01_scale} alt="product image" />
                    </div>
                    <Link href="" aria-label='play button' onClick={(e) => e.preventDefault()} className="play-btn-small">
                      <i className="feather-play" />
                    </Link>
                  </div>
                  <div className="slider-small-thumb">
                    <div className="small-slide-img">
                      <img src={video_slider_img_02_scale} alt="product image" />
                    </div>
                    <Link href="" aria-label='play button' onClick={(e) => e.preventDefault()} className="play-btn-small">
                      <i className="feather-play" />
                    </Link>
                  </div>
                  <div className="slider-small-thumb">
                    <div className="small-slide-img">
                      <img src={video_slider_img_03_scale} alt="product image" />
                    </div>
                    <Link href="" aria-label='play button' onClick={(e) => e.preventDefault()} className="play-btn-small">
                      <i className="feather-play" />
                    </Link>
                  </div>
                  <div className="slider-small-thumb">
                    <div className="small-slide-img">
                      <img src={video_slider_img_04_scale} alt="product image" />
                    </div>
                    <Link href="" aria-label='play button' onClick={(e) => e.preventDefault()} className="play-btn-small">
                      <i className="feather-play" />
                    </Link>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default OurBest;