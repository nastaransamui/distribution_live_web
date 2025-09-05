/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { logo } from '@/public/assets/imagepath';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { formatNumberWithCommas } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { toast } from 'react-toastify';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';

import dayjs from 'dayjs'
import { useTheme } from '@mui/material/styles';
import { AppointmentReservationExtendType } from './PaymentSuccess';
import { base64regex } from '../Profile/PublicProfilePage';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';
import BeatLoader from 'react-spinners/BeatLoader';

export function truncateString(str: string, maxLength: number) {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

const Invoice: FC = (() => {
  const exportRef = useRef<HTMLDivElement>(null);
  const invoiceHeaderRef = useRef<HTMLDivElement>(null);
  const invoiceBodyRef = useRef<HTMLDivElement>(null);
  const invoiceFooterRef = useRef<HTMLDivElement>(null);
  const { muiVar, bounce } = useScssVar();
  const router = useRouter()
  const theme = useTheme();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
  // const userProfile = useSelector((state: AppState) => state.userProfile.value)
  const userPatientProfile = useSelector((state: AppState) => state.userPatientProfile.value)
  const userDoctorProfile = useSelector((state: AppState) => state.userDoctorProfile.value)
  const homeRoleName = useSelector((state: AppState) => state.homeRoleName.value)
  const userProfile = homeRoleName == 'doctors' ? userDoctorProfile : userPatientProfile;

  const [reload, setReload] = useState<boolean>(false)
  const [reservation, setReservation] = useState<AppointmentReservationExtendType | null>(null)


  const searchParams = useSearchParams();
  const encryptID = searchParams.get('_id')

  useEffect(() => {
    let active = true;
    if (encryptID) {
      if (base64regex.test(encryptID)) {
        let _id = atob(encryptID as string)
        if (active && homeSocket?.current) {
          homeSocket.current.emit(`findReservationById`, { _id })
          homeSocket.current.once(`findReservationByIdReturn`, (msg: { status: number, reservation: AppointmentReservationExtendType, reason?: string }) => {
            const { status, reservation, reason } = msg;
            if (status !== 200) {
              toast.error(reason || `Error ${status} find Reservation`, {
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
              homeSocket.current.once(`updateReservationById`, () => {
                setReload(!reload)
              })
              setReservation(reservation)
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

      pdf.save(`${reservation?.invoiceId || "document"}.pdf`);
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
  return (
    <Fragment>
      <div className="content" style={muiVar}>
        <div className="container">
          <div className="row">
            {
              reservation == null ?
                <BeatLoader color={theme.palette.primary.main} style={{
                  minWidth: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }} />
                :
                <div className={`col-lg-8 offset-lg-2 ${isClient ? 'animate__animated animate__backInUp' : 'pre-anim-hidden'}`}>
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
                              <strong>Order:</strong> {reservation.invoiceId} <br />
                              <strong>Issued:</strong> {dayjs(reservation?.createdDate).format(`D MMM YYYY HH:mm`)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="invoice-item">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="invoice-info">
                              <strong className="customer-text">Invoice From</strong>
                              <p className="invoice-details invoice-details-two">
                                Name: Dr. {reservation?.doctorProfile?.firstName} {" "} {reservation?.doctorProfile?.lastName} <br />
                                Address: {`${reservation?.doctorProfile?.address1} ${reservation?.doctorProfile?.address1 !== '' ? ', ' : ''} ${reservation?.doctorProfile?.address2}`.trim().length === 0 ? '---' : `${reservation?.doctorProfile?.address1} ${reservation?.doctorProfile?.address1 !== '' ? ', ' : ''} ${reservation?.doctorProfile?.address2}`}
                                <br />
                                City: {`${reservation?.doctorProfile?.city.trim().length === 0 ? '---' : reservation?.doctorProfile?.city}`}
                                <br />
                                State: {`${reservation?.doctorProfile?.state.trim().length === 0 ? '---' : reservation?.doctorProfile?.state}`}
                                <br />
                                Country: {`${reservation?.doctorProfile?.country.trim().length === 0 ? '---' : reservation?.doctorProfile?.country}`}
                                <br />
                                Speciality: <img src={`${reservation.doctorProfile.specialities[0].image}`} alt='speciality' width={10} height={10} /> {" "}{`${reservation.doctorProfile.specialities[0].specialities}`}
                                <br />
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="invoice-info invoice-info2">
                              <strong className="customer-text" style={{ textAlign: "left" }}>Invoice To</strong>
                              <p className="invoice-details" style={{ textAlign: 'left' }}>
                                Name: {`${reservation?.patientProfile?.gender}${reservation?.patientProfile?.gender !== '' ? '.' : ''}`}{reservation?.patientProfile?.firstName} {" "} {reservation?.patientProfile?.lastName} <br />
                                Address: {`${reservation?.patientProfile?.address1} ${reservation?.patientProfile?.address1 !== '' ? ', ' : ''} ${reservation?.patientProfile?.address2}`.trim().length === 0 ? '---' : `${reservation?.patientProfile?.address1} ${reservation?.patientProfile?.address1 !== '' ? ', ' : ''} ${reservation?.patientProfile?.address2}`}
                                <br />
                                City: {`${reservation?.patientProfile?.city.trim().length === 0 ? '---' : reservation?.patientProfile?.city}`}
                                <br />
                                State: {`${reservation?.patientProfile?.state.trim().length === 0 ? '---' : reservation?.patientProfile?.state}`}
                                <br />
                                Country: {`${reservation?.patientProfile?.country.trim().length === 0 ? '---' : reservation?.patientProfile?.country}`}
                                <br />
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="invoice-info">
                              <strong className="customer-text">Payment Method</strong>
                              <Tooltip title={reservation?.paymentToken} arrow placement='top'>
                                <p className="invoice-details invoice-details-two">
                                  {reservation?.paymentType} <br />
                                  {truncateString(reservation?.paymentToken, 20)} <br />
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
                                <tr>
                                  <th>Description</th>
                                  <th className="text-center">Quantity</th>
                                  <th className="text-center">Price</th>
                                  <th className="text-end">Total</th>
                                </tr>
                              </thead>
                              <tbody style={{ borderTop: "none" }}>
                                <tr>
                                  <td style={{ padding: '10px 0px' }}>{dayjs(reservation.selectedDate).format('DD MMM YYYY')} - {reservation.timeSlot?.period}</td>
                                  <td className="text-center">1</td>
                                  <td className="text-center">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(reservation?.timeSlot?.price.toString())}</td>
                                  <td className="text-end">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(reservation?.timeSlot?.price.toString())}</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '10px 0px' }}>Booking Fee</td>
                                  <td className="text-center">1</td>
                                  <td className="text-center">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                    reservation?.timeSlot?.bookingsFeePrice.toString()
                                  )}</td>
                                  <td className="text-end">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                    reservation?.timeSlot?.bookingsFeePrice.toString()
                                  )}</td>
                                </tr>

                              </tbody>
                            </table>
                          </div>
                        </div>
                        {userProfile?.roleName == 'doctors' ?
                          <div className="col-md-6 col-xl-6 " style={{ minHeight: '300px', position: 'relative' }}>
                            <div id={
                              reservation?.doctorPaymentStatus == "Awaiting Request"
                                ? "rubber_stamp_await"
                                : reservation?.doctorPaymentStatus == "Paid"
                                  ? "rubber_stamp_paid" : "rubber_stamp_pendign"
                            } className={
                              `${reservation?.doctorPaymentStatus == "Awaiting Request"
                                ? "rubber_stamp_await"
                                : reservation?.doctorPaymentStatus == "Paid"
                                  ? "rubber_stamp_paid" : "rubber_stamp_pendign"}
                              `} style={{ left: '30%' }}>{reservation?.doctorPaymentStatus}</div>
                          </div> :
                          <div className="col-md-6 col-xl-6 " style={{ minHeight: '300px', position: 'relative' }}></div>
                        }
                        <div className="col-md-6 col-xl-6 ">
                          <div className="table-responsive">
                            <table className="invoice-table-two table">
                              <tbody>
                                <tr>
                                  <th >Subtotal:</th>
                                  <td style={{ padding: '10px 18px', width: '100%' }}>
                                    <span>{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                      reservation?.timeSlot?.total.toString()
                                    )}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <th>Discount:</th>
                                  <td>
                                    <span>---</span>
                                  </td>
                                </tr>
                                <tr>
                                  <th style={{ width: '40%', }}>Total Amount:</th>
                                  <td style={{ padding: '10px 18px', width: '100%' }}>
                                    <span>{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                      reservation?.timeSlot?.total.toString()
                                    )}</span>
                                  </td>
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

    </Fragment>
  )
});

export default Invoice;