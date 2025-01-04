/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef, useState, useEffect } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { logo } from '@/public/assets/imagepath';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AppState } from '@/redux/store';
import { formatNumberWithCommas, TimeType } from '@/components/DoctorDashboardSections/ScheduleTiming';
import { toast } from 'react-toastify';

import CircleToBlockLoading from 'react-loadingg/lib/CircleToBlockLoading';

import dayjs from 'dayjs'
import { useTheme } from '@mui/material/styles';
import { AppointmentReservationExtendType } from './PaymentSuccess';
import { base64regex } from '../Profile/ProfilePage';

const Invoice: FC = (() => {
  const exportRef = useRef<HTMLDivElement>(null);
  const invoiceHeaderRef = useRef<HTMLDivElement>(null);
  const invoiceBodyRef = useRef<HTMLDivElement>(null);
  const invoiceFooterRef = useRef<HTMLDivElement>(null);
  const { muiVar, bounce } = useScssVar();
  const router = useRouter()
  const theme = useTheme();
  const homeSocket = useSelector((state: AppState) => state.homeSocket.value)
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
              toast.error(reason || `Error ${status} find Doctor`, {
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

    // Inject custom CSS for the PDF
    const customStyles = `
      #pdf-content {
        font-size: 18px;
        background-color: #fff;
        width: 100%; /* Ensure content width is dynamic */
      }
      #pdf-content p,
      #pdf-content td {
        color: black !important;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = "pdf-styles";
    styleSheet.innerText = customStyles;

    // Append styles to the exportRef content
    exportRef.current.appendChild(styleSheet);

    // Define A4 page dimensions in pixels (assuming 96dpi)
    const A4_WIDTH = 210; // mm
    const A4_HEIGHT = 297; // mm
    const DPI = 96; // Dots per inch
    const PX_PER_MM = DPI / 25.4;
    const A4_WIDTH_PX = Math.floor(A4_WIDTH * PX_PER_MM) - 56; // A4 width in pixels
    const A4_HEIGHT_PX = Math.floor(A4_HEIGHT * PX_PER_MM); // A4 height in pixels

    // Render the HTML content to a canvas with A4 dimensions
    const canvas = await html2canvas(exportRef.current, {
      scale: 2, // High resolution
      width: A4_WIDTH_PX, // Match A4 width
      scrollX: 0,
      scrollY: 0,
    });

    // Create a jsPDF instance
    const pdf = new jsPDF("p", "mm", "a4");

    // Calculate image dimensions to fully fill the A4 page
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = A4_WIDTH; // Full width of A4 in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Scale height proportionally
    const headerHeight = invoiceHeaderRef.current?.offsetHeight;
    const bodyHeight = invoiceBodyRef.current?.clientHeight
    const footerHeight = invoiceFooterRef.current?.clientHeight
    let positionY = 0;

    // Loop to handle multiple pages
    while (positionY < imgHeight) {
      pdf.addImage(
        imgData,
        "PNG",
        0,
        positionY === 0 ? 0 : -positionY, // Start from the top of the next slice
        imgWidth,
        imgHeight
      );
      positionY += A4_HEIGHT; // Increment by page height
      if (positionY < imgHeight) pdf.addPage(); // Add a new page if more content
    }

    // Remove the custom styles after exporting
    styleSheet.remove();

    // Save the PDF
    pdf.save("invoice.pdf");
  };


  return (
    <Fragment>
      <div className="content" style={muiVar}>
        <div className="container">
          <div className="row">
            {
              reservation == null ?
                <CircleToBlockLoading color={theme.palette.primary.main} size="small" style={{
                  minWidth: '90%',
                  display: 'flex',
                  justifyContent: 'center',
                }} />
                :
                <div className="col-lg-8 offset-lg-2">
                  <button onClick={handleExport} style={{ width: '100%', marginBottom: 30 }} className='btn btn-primary'>Export as PDF</button>
                  <div className="invoice-content" ref={exportRef} id="pdf-content">
                    <span ref={invoiceHeaderRef}>
                      <div className="invoice-item">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="invoice-logo">
                              <img src={logo} alt="logo" className='imgColorPrimary' />
                            </div>
                          </div>
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <p className="invoice-details">
                              <strong>Order:</strong> {reservation._id} <br />
                              <strong>Issued:</strong> {dayjs(reservation?.createdDate).format(`D MMM YYYY`)}
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
                                Dr. {reservation?.doctorProfile?.firstName} {" "} {reservation?.doctorProfile?.lastName} <br />
                                {reservation?.doctorProfile?.address1} {reservation?.doctorProfile?.address1 !== '' ? ',' : '-----'}{reservation?.doctorProfile?.address2}
                                <br />
                                {`${reservation?.doctorProfile?.city} ${reservation?.doctorProfile?.state} ${reservation?.doctorProfile?.country}`}<br />
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="invoice-info invoice-info2">
                              <strong className="customer-text" style={{ textAlign: "left" }}>Invoice To</strong>
                              <p className="invoice-details" style={{ textAlign: 'left' }}>
                                {`${reservation?.patientProfile?.gender !== '' ? reservation?.patientProfile?.gender + '.' : ''} ${reservation?.patientProfile.firstName} ${reservation?.patientProfile?.lastName}`} <br />
                                {`${reservation?.patientProfile?.address1}`} {reservation?.patientProfile?.address1 !== '' ? ',' : '-----'}{reservation?.patientProfile?.address2}<br />
                                {`${reservation?.patientProfile?.city} ${reservation?.patientProfile?.state} ${reservation?.patientProfile?.country}`}<br /> <br />
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="invoice-info">
                              <strong className="customer-text">Payment Method</strong>
                              <p className="invoice-details invoice-details-two">
                                {reservation?.paymentType} <br />
                                {reservation?.paymentToken} <br />
                                <br />
                              </p>
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
                                  <td style={{ padding: '10px 0px' }}>{reservation.selectedDate} - {reservation.timeSlot?.period}</td>
                                  <td className="text-center">1</td>
                                  <td className="text-center">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(reservation?.timeSlot?.price)}</td>
                                  <td className="text-end">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(reservation?.timeSlot?.price)}</td>
                                </tr>
                                <tr>
                                  <td style={{ padding: '10px 0px' }}>Booking Fee</td>
                                  <td className="text-center">1</td>
                                  <td className="text-center">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                    reservation?.timeSlot?.bookingsFeePrice
                                  )}</td>
                                  <td className="text-end">{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                    reservation?.timeSlot?.bookingsFeePrice
                                  )}</td>
                                </tr>

                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-md-6 col-xl-4 ms-auto">
                          <div className="table-responsive">
                            <table className="invoice-table-two table">
                              <tbody>
                                <tr>
                                  <th>Subtotal:</th>
                                  <td style={{ padding: '10px 0px' }}>
                                    <span>{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                      reservation?.timeSlot?.total
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
                                  <th>Total Amount:</th>
                                  <td style={{ padding: '10px 0px' }}>
                                    <span>{reservation?.timeSlot?.currencySymbol || 'THB'}&nbsp; {formatNumberWithCommas(
                                      reservation?.timeSlot?.total
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