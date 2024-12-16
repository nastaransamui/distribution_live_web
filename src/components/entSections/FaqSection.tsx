import { FC, Fragment, useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import dynamic from 'next/dynamic'
import useScssVar from '@/hooks/useScssVar'
import { BsArrowRightCircle } from 'react-icons/bs'

const Owlcarousel = dynamic(() => import(`react-owl-carousel`), { ssr: false });



const FaqSection: FC = (() => {
  const { muiVar } = useScssVar();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true
    });

  }, []);
  const options = {
    loop: true,
    margin: 24,
    dots: true,
    nav: true,
    smartSpeed: 2000,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    navElement: "button  aria-labelledby='slide-nav-1' aria-label='slide-nav-1'",
    responsive: {
      0: {
        items: 1
      },
      500: {
        items: 1
      },
      768: {
        items: 2
      },
      1000: {
        items: 3
      },
      1300: {
        items: 3
      }
    }
  };
  return (
    <Fragment>
      <section className="frequently-section-fifteen" style={muiVar}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header-fifteen text-center">
                <h2>
                  Frequently <span>Asked Questions</span>
                </h2>
                <p>What our clients say about us</p>
              </div>
            </div>
          </div>
          <div className="frequent-slider-fifteen owl-theme">
            <Owlcarousel className="frequent-slider-fifteen owl-theme"{...options}>
              <div className="items-fift">
                <Link href="#">What is an otolaryngologist?</Link>
                <p>
                  An otolaryngologist is a doctor who specializes in the diagnosis and
                  treatment of ear, nose and throat diseases as well as related
                  structures of the head and neck. Otolaryngologists are also referred
                  to as ENT doctors or physicians. For more information.
                </p>
                <Link href="faq" className="line-arrow">
                  Get Answer
                  <BsArrowRightCircle className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
              <div className="items-fift">
                <Link href="#">What is the treatment ear infection?</Link>
                <p>
                  The majority of ear infections will run their course in about a
                  week. Pain can be managed with over-the-counter medications,
                  eardrops, and warm compresses. If a bacterial infection is the
                  cause, antibiotics are prescribed. Children who experience.
                </p>
                <Link href="#" className="line-arrow">
                  Get Answer
                  <BsArrowRightCircle className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
              <div className="items-fift">
                <Link href="faq">What is obstructive sleep apnea?</Link>
                <p>
                  Obstructive sleep apnea (OSA) is a condition in which an
                  individual’s breathing stops periodically during sleep. These
                  episodes can last ten seconds or longer and may occur hundreds of
                  times each night, preventing restorative sleep.
                </p>
                <Link href="faq" className="line-arrow">
                  Get Answer
                  <BsArrowRightCircle className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
              <div className="items-fift">
                <Link href="#">What is an otolaryngologist?</Link>
                <p>
                  An otolaryngologist is a doctor who specializes in the diagnosis and
                  treatment of ear, nose and throat diseases as well as related
                  structures of the head and neck. Otolaryngologists are also referred
                  to as ENT doctors or physicians. For more information
                </p>
                <Link href="faq" className="line-arrow">
                  Get Answer
                  <BsArrowRightCircle className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
              <div className="items-fift">
                <Link href="#">What is an otolaryngologist?</Link>
                <p>
                  An otolaryngologist is a doctor who specializes in the diagnosis and
                  treatment of ear, nose and throat diseases as well as related
                  structures of the head and neck. Otolaryngologists are also referred
                  to as ENT doctors or physicians. For more information
                </p>
                <Link href="faq" className="line-arrow">
                  Get Answer
                  <BsArrowRightCircle className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
              <div className="items-fift">
                <Link href="#">What is the treatment ear infection?</Link>
                <p>
                  An otolaryngologist is a doctor who specializes in the diagnosis and
                  treatment of ear, nose and throat diseases as well as related
                  structures of the head and neck. Otolaryngologists are also referred
                  to as ENT doctors or physicians. For more information
                </p>
                <Link href="faq" className="line-arrow">
                  Get Answer
                  <BsArrowRightCircle className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
              <div className="items-fift">
                <Link href="#">What is the treatment ear infection?</Link>
                <p>
                  An otolaryngologist is a doctor who specializes in the diagnosis and
                  treatment of ear, nose and throat diseases as well as related
                  structures of the head and neck. Otolaryngologists are also referred
                  to as ENT doctors or physicians. For more information
                </p>
                <Link href="faq" className="line-arrow">
                  Get Answer
                  <BsArrowRightCircle className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
              <div className="items-fift">
                <Link href="#">What is the treatment ear infection?</Link>
                <p>
                  An otolaryngologist is a doctor who specializes in the diagnosis and
                  treatment of ear, nose and throat diseases as well as related
                  structures of the head and neck. Otolaryngologists are also referred
                  to as ENT doctors or physicians. For more information
                </p>
                <Link href="faq" className="line-arrow">
                  Get Answer
                  <BsArrowRightCircle className="feather-arrow-right-circle ms-2" />
                </Link>
              </div>
            </Owlcarousel>
          </div>
        </div>
      </section>
    </Fragment>
  )
});

export default FaqSection;