/* eslint-disable @next/next/no-img-element */
import { FC, Fragment } from 'react'
import useScssVar from '@/hooks/useScssVar'
import Link from 'next/link'
import { useTheme } from '@mui/material'
import { AtomBondSvg } from '../../../public/assets/images/icons/IconsSvgs'
import { articles_1, articles_2, articles_3, articles_4 } from '@/public/assets/imagepath'

const BlogSection: FC = (() => {
  const { muiVar } = useScssVar();
  const theme = useTheme();

  return (
    <Fragment>
      <section className="latest-articles-thirteen common-padding" style={{ ...muiVar, backgroundColor: theme.palette.background.paper }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 aos" data-aos="fade-up">
              <div className="section-header-thirteen">
                <div className="section-inner-thirteen">
                  <AtomBondSvg />
                </div>
                <h2>Our Latest Articles</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="articles-thirteen">
                <div className="articles-thirteen-img">
                  <Link href="/blog/blog-details"><img src={articles_1} alt="#" className="img-fluid" /></Link>
                </div>
                <div className="articles-thirteen-content">
                  <h6>Paediatrician</h6>
                  <Link href="/blog/blog-details">Our experts will take care of your child...</Link>
                  <p>In the first of this series focused on the prevention and treatment of running injuries,
                    Physiotherapist
                    looks at how runners can prevent injuries by identifying vulnerable muscles through an easy Movement Control Assessment.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="articles-thirteen">
                <div className="articles-thirteen-img">
                  <Link href="/blog/blog-details"><img src={articles_2} alt="#" className="img-fluid" /></Link>
                </div>
                <div className="articles-thirteen-content">
                  <h6>Paediatrician</h6>
                  <Link href="/blog/blog-details">We Care for your Children Most Effective Treatment</Link>
                  <p>In the first of this series focused on the prevention and treatment of running injuries,
                    Physiotherapist
                    looks at how runners can prevent injuries by identifying vulnerable muscles through an easy Movement Control Assessment.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="articles-thirteen">
                <div className="articles-thirteen-img">
                  <Link href="/blog/blog-details"><img src={articles_3} alt="#" className="img-fluid" /></Link>
                </div>
                <div className="articles-thirteen-content">
                  <h6>Paediatrician</h6>
                  <Link href="/blog/blog-details">The first step of the toddler
                    Beyond </Link>
                  <p>In the first of this series focused on the prevention and treatment of running injuries,
                    Physiotherapist
                    looks at how runners can prevent injuries by identifying vulnerable muscles through an easy Movement Control Assessment.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="articles-thirteen">
                <div className="articles-thirteen-img">
                  <Link href="/blog/blog-details"><img src={articles_4} alt="#" className="img-fluid" /></Link>
                </div>
                <div className="articles-thirteen-content">
                  <h6>Paediatrician</h6>
                  <Link href="/blog/blog-details">Balanced Diet Chart for Children</Link>
                  <p>In the first of this series focused on the prevention and treatment of running injuries,
                    Physiotherapist
                    looks at how runners can prevent injuries by identifying vulnerable muscles through an easy Movement Control Assessment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
})

export default BlogSection;