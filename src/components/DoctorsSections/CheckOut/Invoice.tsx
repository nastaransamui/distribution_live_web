/* eslint-disable @next/next/no-img-element */
import { FC, Fragment, useRef } from 'react'
import useScssVar from '@/hooks/useScssVar'
import { logo } from '@/public/assets/imagepath';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Invoice: FC = (() => {
  const { muiVar } = useScssVar();
  const exportRef = useRef<HTMLDivElement>(null);
  const invoiceHeaderRef = useRef<HTMLDivElement>(null);
  const invoiceBodyRef = useRef<HTMLDivElement>(null);
  const invoiceFooterRef = useRef<HTMLDivElement>(null);

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
    const A4_WIDTH_PX = Math.floor(A4_WIDTH * PX_PER_MM) + 65; // A4 width in pixels
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
    console.log({
      imgHeight,
      A4_HEIGHT_PX,
      heieght: canvas.height,
      headerHeight,
      bodyHeight,
      footerHeight,
    })
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
            <div className="col-lg-8 offset-lg-2">
              <button onClick={handleExport} style={{ width: '100%', marginBottom: 30 }} className='btn btn-primary'>Export as PDF</button>
              <div className="invoice-content" ref={exportRef} id="pdf-content">
                <span ref={invoiceHeaderRef}>
                  <div className="invoice-item">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="invoice-logo">
                          <img src={logo} alt="logo" className='imgColorPrimary' />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <p className="invoice-details">
                          <strong>Order:</strong> #00124 <br />
                          <strong>Issued:</strong> 20/07/2019
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
                            Dr. Darren Elder <br />
                            806 Twin Willow Lane, Old Forge,
                            <br />
                            Newyork, USA <br />
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="invoice-info invoice-info2">
                          <strong className="customer-text" style={{ textAlign: "left" }}>Invoice To</strong>
                          <p className="invoice-details" style={{ textAlign: 'left' }}>
                            Walter Roberson <br />
                            299 Star Trek Drive, Panama City, <br />
                            Florida, 32405, USA <br />
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="invoice-info">
                          <strong className="customer-text">Payment Method</strong>
                          <p className="invoice-details invoice-details-two">
                            Debit Card <br />
                            XXXXXXXXXXXX-2541 <br />
                            HDFC Bank
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
                              <th className="text-center">VAT</th>
                              <th className="text-end">Total</th>
                            </tr>
                          </thead>
                          <tbody style={{ borderTop: "none" }}>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            {/* <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr>
                            <tr>
                              <td>General Consultation</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$100</td>
                            </tr>
                            <tr>
                              <td>Video Call Booking</td>
                              <td className="text-center">1</td>
                              <td className="text-center">$0</td>
                              <td className="text-end">$250</td>
                            </tr> */}
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
                              <td>
                                <span>$350</span>
                              </td>
                            </tr>
                            <tr>
                              <th>Discount:</th>
                              <td>
                                <span>-10%</span>
                              </td>
                            </tr>
                            <tr>
                              <th>Total Amount:</th>
                              <td>
                                <span>$315</span>
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
          </div>
        </div>
      </div>
    </Fragment>
  )
});

export default Invoice;