/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { logo } from '@/public/assets/imagepath';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { formatNumberWithCommas } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { toast } from 'react-toastify';


import dayjs from 'dayjs'

import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';
import { BillingTypeWithDoctorProfile } from '@/components/DoctorDashboardSections/EditBilling';
import { base64regex } from '@/components/DoctorsSections/Profile/PublicProfilePage';
import { PatientProfile } from '@/components/DoctorDashboardSections/MyPtients';
import { BillingDetailsArrayType } from '@/components/DoctorDashboardSections/AddBilling';

import { useTheme } from '@mui/material/styles';
import BeatLoader from 'react-spinners/BeatLoader';

export interface BillingTypeWithDoctorProfileAndPatientProfile extends BillingTypeWithDoctorProfile {
  patientProfile: PatientProfile
}
export function truncateString(str: string, maxLength: number) {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}


const BillInvoice: FC<any | undefined> = (({ doctorPatientProfile }) => {
  const theme = useTheme();
  const exportRef = useRef<HTMLDivElement>(null);
  const invoiceHeaderRef = useRef<HTMLDivElement>(null);
  const invoiceBodyRef = useRef<HTMLDivElement>(null);
  const invoiceFooterRef = useRef<HTMLDivElement>(null);
  const { muiVar, bounce } = useScssVar();
  const router = useRouter()

  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const [reload, setReload] = useState<boolean>(false)
  const [singleBill, setSingleBill] = useState<BillingTypeWithDoctorProfileAndPatientProfile>();

  const encryptID = router.query._id;

  useEffect(() => {
    let active = true;
    if (encryptID) {
      if (base64regex.test(encryptID as string)) {
        let _id = atob(encryptID as string)
        if (active && homeSocket?.current) {
          homeSocket.current.emit(`getSingleBillingForPatient`, { billing_id: _id, patientId: homeRoleName == 'doctors' ? doctorPatientProfile._id : userProfile?._id })
          homeSocket.current.once(`getSingleBillingForPatientReturn`, (msg: { status: number, singleBill: BillingTypeWithDoctorProfileAndPatientProfile[], reason?: string, massage?: string }) => {
            const { status, singleBill, reason } = msg;
            if (status !== 200) {
              toast.error(msg?.massage || `Error ${status} find Bill`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: bounce,
                onClose: () => {
                  router.back()
                }
              });
            } else {
              homeSocket.current.once(`updateGetSingleBillingForPatientReturn`, () => {
                setReload(!reload)
              })
              if (singleBill && singleBill.length > 0) {
                setSingleBill(singleBill[0])
              }

            }
          })
        }
      }
    }
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptID, homeSocket, reload, router])
  const handleExport = async () => {
    if (!exportRef.current) return;

    // mm page sizes
    const A4_W_MM = 210;
    const A4_H_MM = 297;

    // clone node so we don't disturb layout
    const original = exportRef.current;
    const clone = original.cloneNode(true) as HTMLElement;

    // force clone to exact A4 CSS width so html2canvas produces an image that maps to mm correctly
    clone.style.width = `${A4_W_MM}mm`;
    clone.style.boxSizing = "border-box";
    clone.style.background = "#fff"; // ensure white background
    // put it off-screen so it doesn't flash to the user
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    const style = document.createElement("style");
    style.innerHTML = `
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
    #pdf-content {
     font-size: 18px;
        height: auto !important;
        min-height: ${A4_H_MM - 1}mm; /* optional: gives it at least one page height visually */
        overflow: visible !important;
        border: 1px solid ${theme.palette.secondary.main};
        box-sizing: border-box;
        display: block;
        }
  #pdf-content, #pdf-content * {
    color: #000 ;   /* force pure black text */
  }
      #rubber_stamp_await{
      color: ${theme.palette.error.main} !important;
      border: 3px solid ${theme.palette.error.main};
      }
  #rubber_stamp_paid{
    color: ${theme.palette.success.main} !important;
    border: 3px solid ${theme.palette.success.main};
  }
  #rubber_stamp_pendign {
    color: #ffa500 !important;
    border: 3px solid #ffa500;
  }
  table.table thead tr th,
  table.table tbody tr  {
  border-bottom:1px solid ${theme.palette.primary.main} !important;
  }
    
    #totalPriceTH,
    #totalPriceNumber{
    border-top: 0 !important;
    margin-top: -2px !important;
    }
  strong, th{
    color: ${theme.palette.primary.main} !important;
    }
`;
    clone.appendChild(style);
    document.body.appendChild(clone);

    // wait for fonts to be ready so sizes are stable
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    try {
      // Use devicePixelRatio for crisp canvas
      const scale = Math.max(1, window.devicePixelRatio || 1);

      // Render the clone to canvas (do NOT pass width/height here; let html2canvas render the full clone)
      const canvas = await html2canvas(clone, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
      });


      // compute px per mm from canvas: canvas.width pixels === 210 mm
      const pxPerMm = canvas.width / A4_W_MM;

      // page height in pixels on the canvas
      const pageHeightPx = Math.floor(A4_H_MM * pxPerMm);

      const pdf = new jsPDF("p", "mm", "a4");

      let positionY = 0;
      let pageIndex = 0;

      while (positionY < canvas.height) {
        const sliceHeight = Math.min(pageHeightPx, canvas.height - positionY);

        // make temp canvas for the page slice
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");

        ctx.drawImage(canvas, 0, positionY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

        const imgData = pageCanvas.toDataURL("image/png");

        const PAGE_MARGIN_MM = 1; // set to whatever gutter you want

        // convert slice pixel height to mm using pxPerMm
        const imgHeightMM = sliceHeight / pxPerMm;

        // available space inside the page after margins
        const availableWidthMM = A4_W_MM - 2 * PAGE_MARGIN_MM;
        const availableHeightMM = A4_H_MM - 2 * PAGE_MARGIN_MM;

        // compute uniform scale so image fits inside available box (preserve aspect ratio)
        const scaleW = availableWidthMM / A4_W_MM;
        const scaleH = availableHeightMM / imgHeightMM;
        const scale = Math.min(scaleW, scaleH);

        // final draw size
        const drawWidthMM = A4_W_MM * scale;
        const drawHeightMM = imgHeightMM * scale;

        // position so the image is centered inside the page (this guarantees margins >= PAGE_MARGIN_MM)
        const x = (A4_W_MM - drawWidthMM) / 2;
        const y = (A4_H_MM - drawHeightMM) / 2;

        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", x, y, drawWidthMM, drawHeightMM);

        positionY += sliceHeight;
        pageIndex++;
      }

      pdf.save(`${singleBill?.invoiceId || "document"}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      // cleanup the clone
      if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
    }
  };
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsClient(true), 20);
    return () => {
      setIsClient(false)
    }
  }, [])
  const isSameDoctor = singleBill?.doctorId == userProfile?._id
  return (
    <Fragment>
      <div className="content" style={muiVar}>
        <div className="container">
          <div className="row">
            {
              !singleBill || userProfile == null ?
                <BeatLoader color={theme.palette.primary.main} style={{
                  minWidth: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }} />
                :
                <div className={`col-lg-8 offset-lg-2   ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>
                  <button onClick={handleExport} style={{ width: '100%', marginBottom: 30 }} className='btn btn-primary'>Export as PDF</button>
                  <div className="invoice-content" ref={exportRef} id="pdf-content">
                    <span ref={invoiceHeaderRef}>
                      <div className="invoice-item">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="invoice-logo">
                              <img src={logo} alt="logo" />
                            </div>
                          </div>
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <p className="invoice-details">
                              <strong>Order:</strong> {singleBill.invoiceId} <br />
                              <strong>Issued:</strong> {dayjs(singleBill?.createdAt).format(`D MMM YYYY`)}<br />
                              <strong>Due date:</strong> {dayjs(singleBill?.dueDate).format(`D MMM YYYY`)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="invoice-item">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="invoice-info">
                              <strong className="customer-text" id='customer-text'>Invoice From</strong>
                              <p className="invoice-details invoice-details-two">
                                Name: Dr.{singleBill?.doctorProfile?.firstName} {" "} {singleBill?.doctorProfile?.lastName} <br />
                                Address: {`${singleBill?.doctorProfile?.address1} ${singleBill?.doctorProfile?.address1 !== '' ? ', ' : ''} ${singleBill?.doctorProfile?.address2}`.trim().length === 0 ? '---' : `${singleBill?.doctorProfile?.address1} ${singleBill?.doctorProfile?.address1 !== '' ? ', ' : ''} ${singleBill?.doctorProfile?.address2}`}
                                <br />
                                City: {`${singleBill?.doctorProfile?.city.trim().length === 0 ? '---' : singleBill?.doctorProfile?.city}`}
                                <br />
                                State: {`${singleBill?.doctorProfile?.state.trim().length === 0 ? '---' : singleBill?.doctorProfile?.state}`}
                                <br />
                                Country: {`${singleBill?.doctorProfile?.country.trim().length === 0 ? '---' : singleBill?.doctorProfile?.country}`}
                                <br />
                                Speciality: <img src={`${singleBill.doctorProfile.specialities[0].image}`} alt='speciality' width={10} height={10} /> {" "}{`${singleBill.doctorProfile.specialities[0].specialities}`}
                                <br />
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="invoice-info invoice-info2">
                              <strong className="customer-text" style={{ textAlign: "left" }}>Invoice To</strong>
                              <p className="invoice-details" style={{ textAlign: 'left' }}>
                                Name: {`${singleBill?.patientProfile?.gender}${singleBill?.patientProfile?.gender !== '' ? '.' : ''}`}{singleBill?.patientProfile?.firstName} {" "} {singleBill?.patientProfile?.lastName} <br />
                                Address: {`${singleBill?.patientProfile?.address1} ${singleBill?.patientProfile?.address1 !== '' ? ', ' : ''} ${singleBill?.patientProfile?.address2}`.trim().length === 0 ? '---' : `${singleBill?.patientProfile?.address1} ${singleBill?.patientProfile?.address1 !== '' ? ', ' : ''} ${singleBill?.patientProfile?.address2}`}
                                <br />
                                City: {`${singleBill?.patientProfile?.city.trim().length === 0 ? '---' : singleBill?.patientProfile?.city}`}
                                <br />
                                State: {`${singleBill?.patientProfile?.state.trim().length === 0 ? '---' : singleBill?.patientProfile?.state}`}
                                <br />
                                Country: {`${singleBill?.patientProfile?.country.trim().length === 0 ? '---' : singleBill?.patientProfile?.country}`}
                                <br />
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="invoice-info">
                              <strong className="customer-text">Payment Method</strong>
                              <Tooltip title={singleBill?.paymentToken} arrow placement='top'>
                                <p className="invoice-details invoice-details-two">
                                  {singleBill?.paymentType} <br />
                                  {truncateString(singleBill?.paymentToken, 20)} <br />
                                  {singleBill?.paymentDate !== '' && dayjs(singleBill?.paymentDate).format(`D MMM YYYY HH:mm`)}
                                  <br />
                                </p>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </span>
                    <div className="invoice-item invoice-table-wrap" ref={invoiceBodyRef}>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="table-responsive">
                            <table className="invoice-table table table-bordered">
                              <thead style={{ borderBottom: "none" }}>
                                {/*  */}
                                <tr>
                                  {
                                    Object.keys(singleBill.billDetailsArray[0]).filter((a: string) => {
                                      if (userProfile?.roleName == 'patient' || !isSameDoctor) {
                                        return a == 'title' || a == 'total'
                                      } else {
                                        return a !== 'amount'
                                      }
                                    }).map((pres: string, index: number) => {
                                      return (
                                        <th className={userProfile?.roleName == 'patient' || !isSameDoctor ? pres == 'title' ? 'text-left' : "text-end" : index !== 0 ? "text-center" : ''} key={index}>{`${pres.charAt(0).toLocaleUpperCase()}${pres.slice(1)}`}</th>
                                      )
                                    })
                                  }
                                </tr>
                              </thead>
                              <tbody style={{ borderTop: "none" }}>
                                {
                                  singleBill.billDetailsArray.map((a: BillingDetailsArrayType, index: number) => {
                                    return (
                                      <tr key={index}>
                                        <td style={{ textAlign: userProfile?.roleName == 'patient' || !isSameDoctor ? 'left' : "left" }}>{a.title}</td>
                                        {
                                          userProfile?.roleName == 'doctors' && isSameDoctor &&
                                          <>
                                            <td className="text-center">{formatNumberWithCommas(a.price?.toString()!)}</td>
                                            <td className="text-center">{`${a.bookingsFee} %`}</td>
                                            <td className="text-center">{`${singleBill?.currencySymbol} ${formatNumberWithCommas(a.bookingsFeePrice.toString())}`}</td>
                                          </>
                                        }
                                        <td style={{ whiteSpace: 'pre', }} className="text-end">
                                          {`${singleBill?.currencySymbol} ${formatNumberWithCommas(a.total.toString())}`}
                                        </td>
                                      </tr>
                                    )
                                  })
                                }

                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="col-md-6 col-xl-4 ms-auto" style={{ minHeight: '300px', position: 'relative' }}>
                          <div id={
                            singleBill?.status !== 'Paid' && (dayjs(singleBill?.dueDate).isBefore(dayjs(), 'day') || dayjs(singleBill?.dueDate).isSame(dayjs(), 'day'))
                              ? "rubber_stamp_await"
                              : singleBill?.status == "Paid"
                                ? "rubber_stamp_paid" : "rubber_stamp_pendign"}

                            className={
                              `${singleBill?.status !== 'Paid' && (dayjs(singleBill?.dueDate).isBefore(dayjs(), 'day') || dayjs(singleBill?.dueDate).isSame(dayjs(), 'day'))
                                ? "rubber_stamp_await"
                                : singleBill?.status == "Paid"
                                  ? "rubber_stamp_paid" : "rubber_stamp_pendign"}
                              `}>{`${singleBill?.status !== 'Paid' && (dayjs(singleBill?.dueDate).isBefore(dayjs(), 'day') || dayjs(singleBill?.dueDate).isSame(dayjs(), 'day')) ? `Over Due` : singleBill?.status}`}
                          </div>
                        </div>
                        <div className="col-md-6 col-xl-6 ms-auto">
                          <div className="table-responsive">
                            <table className="invoice-table-two table">
                              <tbody>
                                <tr>
                                  {
                                    userProfile?.roleName == 'doctors' && isSameDoctor && <>
                                      <th id='totalPriceTH,
                                      #totalPriceNumber'>Total Price:</th>
                                      <td style={{ padding: '10px 0px' }} id='totalPriceNumber'>
                                        <span style={{ paddingRight: '18px' }} >
                                          {singleBill?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                            singleBill?.price.toString()
                                          )}
                                        </span>
                                      </td>
                                    </>
                                  }
                                </tr>
                                <tr>
                                  {
                                    userProfile?.roleName == 'doctors' && isSameDoctor ? <>
                                      <th>Total Fee Price:</th>
                                      <td style={{ padding: '10px 0px' }}>
                                        <span style={{ paddingRight: '18px' }}>
                                          {singleBill?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                            singleBill?.bookingsFeePrice.toString()
                                          )}
                                        </span>
                                      </td>
                                    </> :
                                      <>
                                        <th>Total:</th>
                                        <td style={{ padding: '10px 0px' }}>
                                          <span style={{ paddingRight: '18px' }}>{singleBill?.currencySymbol || 'THB'}&nbsp;
                                            {formatNumberWithCommas(
                                              singleBill?.total.toString()
                                            )}</span>
                                        </td>
                                      </>
                                  }
                                </tr>
                                <tr>
                                  {
                                    userProfile?.roleName == 'doctors' && isSameDoctor && <>
                                      <th>Total:</th>
                                      <td style={{ padding: '10px 0px' }}>
                                        <span style={{ paddingRight: '18px' }}>{singleBill?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                          singleBill?.total.toString()
                                        )}</span>
                                      </td>
                                    </>
                                  }
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="other-info" ref={invoiceFooterRef}>
                      <h1 style={{ fontSize: 18 }}>Other information</h1>
                      <p className="text-muted mb-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                        sed dictum ligula, cursus blandit risus. Maecenas eget metus non
                        tellus dignissim aliquam ut a ex. Maecenas sed vehicula dui, ac
                        suscipit lacus. Sed finibus leo vitae lorem interdum, eu
                        scelerisque tellus fermentum. Curabitur sit amet lacinia lorem.
                        Nullam finibus pellentesque libero.
                      </p>
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
      </div>

    </Fragment >
  )
});

export default BillInvoice;