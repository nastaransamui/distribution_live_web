import { FC, Fragment, useEffect, useState } from 'react'

import Link from 'next/link'

import { AwardType, DoctorProfileType, EducationType, ExperienceType, MembershipsType, RegistrationsType } from '@/components/SearchDoctorSections/SearchDoctorSection';
import dayjs from 'dayjs';
import preciseDiff from 'dayjs-precise-range'

export interface DoctorPublicProfileOverViewType {
  profile: DoctorProfileType
}

const DoctorPublicProfileOverViewTap: FC<DoctorPublicProfileOverViewType> = (({ profile }) => {
  dayjs.extend(preciseDiff)

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true);
    return () => {
      setIsClient(false)
    }
  }, [])
  return (
    <Fragment>

      <div className="card-body pt-0">
        <div className="tab-content pt-0">
          <div className={`location-list   ${isClient ? 'animate__animated animate__slideInRight' : 'pre-anim-hidden'}`}>
            <div className="row " >
              <div className={`col-md-12 col-lg-9 `}>
                {/* About Details */}
                <div className="widget about-widget">
                  <h1 className="widget-title">About Me</h1>
                  <p style={{ whiteSpace: 'pre-wrap' }}>
                    {profile?.aboutMe}
                  </p>
                </div>
                {/* /About Details */}
                {/* Education Details */}
                <div className="widget education-widget">
                  <h1 className="widget-title">Education</h1>
                  <div className="experience-box">
                    <ul className="experience-list">
                      {
                        profile.educations.map((ed: EducationType, i) => {
                          return (
                            <li key={i}>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <Link href="" className="name" onClick={(e) => e.preventDefault()}>
                                    {ed?.collage}
                                  </Link>
                                  <div>{ed.degree}</div>
                                  <span className="time">{dayjs(ed.yearOfCompletion).format('DD MMM YYYY')}</span>
                                </div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
                {/* /Education Details */}
                {/* Experience Details */}
                <div className="widget experience-widget">
                  <h1 className="widget-title">Work &amp; Experience</h1>
                  <div className="experience-box">
                    <ul className="experience-list">
                      {
                        profile.experinces.map((ex: ExperienceType, i: number) => {
                          //@ts-ignore
                          let { years, months, days } = dayjs.preciseDiff(ex.from, ex.to, true)
                          return (
                            <li key={i}>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <Link href="" className="name" onClick={(e) => e.preventDefault()}>
                                    {ex.hospitalName} ({ex.designation})
                                  </Link>
                                  <span className="time">{dayjs(ex.from).format('DD MMM YYYY')} - {dayjs(ex.to).format('DD MMM YYYY')}
                                    ({`${isNaN(years) ? '--' : years} years ${isNaN(months) ? '--' : months} months ${isNaN(days) ? '--' : days} days`})
                                  </span>
                                </div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
                <div className="widget awards-widget">
                  <h1 className="widget-title">Awards</h1>
                  <div className="experience-box">
                    <ul className="experience-list">
                      {
                        profile?.awards.map((awr: AwardType, i: number) => {
                          return (
                            <li key={i}>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <p className="exp-year">{dayjs(awr.year).format('MMM YYYY')}</p>
                                  <h1 className="exp-title">{awr.award}</h1>
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing
                                    elit. Proin a ipsum tellus. Interdum et malesuada
                                    fames ac ante ipsum primis in faucibus.
                                  </p>
                                </div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>

                <div className="widget awards-widget">
                  <h1 className="widget-title">Registrations</h1>
                  <div className="experience-box">
                    <ul className="experience-list">
                      {
                        profile?.registrations.map((register: RegistrationsType, i: number) => {
                          return (
                            <li key={i}>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <p className="exp-year">{dayjs(register.year).format('MMM YYYY')}</p>
                                  <h1 className="exp-title">{register.registration}</h1>
                                  <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing
                                    elit. Proin a ipsum tellus. Interdum et malesuada
                                    fames ac ante ipsum primis in faucibus.
                                  </p>
                                </div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>


                <div className="widget experience-widget">
                  <h1 className="widget-title">Memberships</h1>
                  <div className="experience-box">
                    <ul className="experience-list">
                      {
                        profile.memberships.map((member: MembershipsType, i: number) => {

                          return (
                            <li key={i}>
                              <div className="experience-user">
                                <div className="before-circle" />
                              </div>
                              <div className="experience-content">
                                <div className="timeline-content">
                                  <Link href="" className="name" onClick={(e) => e.preventDefault()}>
                                    {member.membership}
                                  </Link>
                                </div>
                              </div>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>

                <div className="service-list">
                  <h1 className="widget-title">Services</h1>
                  <ul className="clearfix">
                    {
                      profile.specialitiesServices.map((s: string, i: number) => {
                        return (
                          <li key={i}>{s}</li>
                        )
                      })
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  )
})

export default DoctorPublicProfileOverViewTap;