import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ReportData {
  title: string;
  content: string;
  metadata: {
    generatedAt: string;
    model?: string;
  };
  insights?: {
    keyFindings: string[];
    recommendations: string[];
    riskFactors: string[];
    financialHealthScore?: number;
    trends?: {
      spending: string;
      income: string;
      savings: string;
      netWorth: string;
    };
    opportunities?: string[];
    warnings?: string[];
  };
}

export async function generateReportPDF(report: ReportData): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Create a completely isolated container for the PDF content
      const tempContainer = document.createElement("div");
      tempContainer.style.cssText = `
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        width: 800px !important;
        padding: 40px !important;
        background-color: #ffffff !important;
        font-family: Arial, sans-serif !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        color: #333333 !important;
        overflow: visible !important;
        border: none !important;
        margin: 0 !important;
        box-sizing: border-box !important;
        all: unset !important;
        display: block !important;
      `;

      // Reset all inherited styles
      tempContainer.setAttribute("style", tempContainer.style.cssText);

      // Generate HTML content for the PDF
      const htmlContent = generateReportHTML(report);
      tempContainer.innerHTML = htmlContent;

      // Add to DOM temporarily
      document.body.appendChild(tempContainer);

      // Wait for fonts and images to load
      setTimeout(async () => {
        try {
          // Convert HTML to canvas
          const canvas = await html2canvas(tempContainer, {
            scale: 2, // Higher quality
            useCORS: false,
            allowTaint: false,
            backgroundColor: "#ffffff",
            width: 800,
            height: tempContainer.scrollHeight,
            scrollX: 0,
            scrollY: 0,
            ignoreElements: (element) => {
              // Skip elements that might cause issues
              return (
                element.tagName === "SCRIPT" ||
                element.tagName === "STYLE" ||
                element.classList?.contains("ignore-pdf")
              );
            },
            onclone: (clonedDoc) => {
              // Remove all existing stylesheets that might contain lab() functions
              const existingStyles = clonedDoc.querySelectorAll(
                'link[rel="stylesheet"], style'
              );
              existingStyles.forEach((style) => style.remove());

              // Add our own safe CSS
              const style = clonedDoc.createElement("style");
              style.textContent = `
                * {
                  all: unset !important;
                  display: revert !important;
                  box-sizing: border-box !important;
                }
                div {
                  display: block !important;
                  background-color: #ffffff !important;
                  color: #333333 !important;
                  font-family: Arial, sans-serif !important;
                  font-size: 14px !important;
                  line-height: 1.6 !important;
                }
                h1, h2, h3, h4, h5, h6 {
                  display: block !important;
                  color: #1f2937 !important;
                  background-color: #ffffff !important;
                  font-weight: bold !important;
                  margin: 0 0 10px 0 !important;
                }
                p, span, li {
                  display: block !important;
                  color: #333333 !important;
                  background-color: transparent !important;
                }
                ul {
                  display: block !important;
                  list-style-type: disc !important;
                  margin: 8px 0 !important;
                  padding-left: 20px !important;
                }
                li {
                  display: list-item !important;
                  margin: 4px 0 !important;
                }
                span {
                  display: inline !important;
                }
              `;
              clonedDoc.head.appendChild(style);
            },
          });

          // Create PDF
          const pdf = new jsPDF("p", "mm", "a4");
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 295; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;

          let position = 0;

          // Add image to PDF
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            position,
            imgWidth,
            imgHeight
          );
          heightLeft -= pageHeight;

          // Add new pages if content is longer than one page
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(
              canvas.toDataURL("image/png"),
              "PNG",
              0,
              position,
              imgWidth,
              imgHeight
            );
            heightLeft -= pageHeight;
          }

          // Download the PDF
          const fileName = `${report.title
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}_report.pdf`;
          pdf.save(fileName);

          // Clean up
          document.body.removeChild(tempContainer);
          resolve();
        } catch (error) {
          // Clean up on error
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
          reject(error);
        }
      }, 100); // Small delay to ensure DOM is ready
    } catch (error) {
      reject(error);
    }
  });
}

function generateReportHTML(report: ReportData): string {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatHealthScore = (score?: number) => {
    if (!score) return "N/A";
    const color =
      score >= 80
        ? "#10b981"
        : score >= 60
        ? "#3b82f6"
        : score >= 40
        ? "#f59e0b"
        : "#ef4444";
    return `<span style="color: ${color}; font-weight: bold;">${score}/100</span>`;
  };

  const formatList = (items: string[]) => {
    if (!items || items.length === 0) return "<p>None identified</p>";
    return `<ul style="margin: 8px 0; padding-left: 20px;">${items
      .map((item) => `<li style="margin: 4px 0;">${item}</li>`)
      .join("")}</ul>`;
  };

  return `
        <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff; color: #333333;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; background-color: #ffffff;">
            <h1 style="color: #1f2937; font-size: 28px; margin: 0 0 10px 0; font-weight: bold; background-color: #ffffff;">
              ${report.title}
            </h1>
            <div style="color: #6b7280; font-size: 14px; background-color: #ffffff;">
              <p style="margin: 4px 0; color: #6b7280;">Generated on: ${formatDate(
                report.metadata.generatedAt
              )}</p>
              <p style="margin: 4px 0; color: #6b7280;">Model: ${
                report.metadata.model || "AI Generated"
              }</p>
            </div>
          </div>

      <!-- Financial Health Score -->
      ${
        report.insights?.financialHealthScore
          ? `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 10px 0; font-weight: bold;">
            Financial Health Score
          </h2>
          <div style="font-size: 24px; font-weight: bold; margin: 10px 0;">
            ${formatHealthScore(report.insights.financialHealthScore)}
          </div>
        </div>
      `
          : ""
      }

      <!-- Key Findings -->
      ${
        report.insights?.keyFindings && report.insights.keyFindings.length > 0
          ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-left: 4px solid #3b82f6; padding-left: 15px;">
            Key Findings
          </h2>
          ${formatList(report.insights.keyFindings)}
        </div>
      `
          : ""
      }

      <!-- Recommendations -->
      ${
        report.insights?.recommendations &&
        report.insights.recommendations.length > 0
          ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-left: 4px solid #10b981; padding-left: 15px;">
            Recommendations
          </h2>
          ${formatList(report.insights.recommendations)}
        </div>
      `
          : ""
      }

      <!-- Risk Factors -->
      ${
        report.insights?.riskFactors && report.insights.riskFactors.length > 0
          ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-left: 4px solid #ef4444; padding-left: 15px;">
            Risk Factors
          </h2>
          ${formatList(report.insights.riskFactors)}
        </div>
      `
          : ""
      }

      <!-- Trends -->
      ${
        report.insights?.trends
          ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-left: 4px solid #8b5cf6; padding-left: 15px;">
            Financial Trends
          </h2>
          <div style="background: #f8fafc; border-radius: 6px; padding: 15px;">
            ${
              report.insights.trends.spending
                ? `<p style="margin: 8px 0;"><strong>Spending:</strong> ${report.insights.trends.spending}</p>`
                : ""
            }
            ${
              report.insights.trends.income
                ? `<p style="margin: 8px 0;"><strong>Income:</strong> ${report.insights.trends.income}</p>`
                : ""
            }
            ${
              report.insights.trends.savings
                ? `<p style="margin: 8px 0;"><strong>Savings:</strong> ${report.insights.trends.savings}</p>`
                : ""
            }
            ${
              report.insights.trends.netWorth
                ? `<p style="margin: 8px 0;"><strong>Net Worth:</strong> ${report.insights.trends.netWorth}</p>`
                : ""
            }
          </div>
        </div>
      `
          : ""
      }

      <!-- Opportunities -->
      ${
        report.insights?.opportunities &&
        report.insights.opportunities.length > 0
          ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-left: 4px solid #f59e0b; padding-left: 15px;">
            Opportunities
          </h2>
          ${formatList(report.insights.opportunities)}
        </div>
      `
          : ""
      }

      <!-- Warnings -->
      ${
        report.insights?.warnings && report.insights.warnings.length > 0
          ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-left: 4px solid #ef4444; padding-left: 15px;">
            Warnings
          </h2>
          ${formatList(report.insights.warnings)}
        </div>
      `
          : ""
      }

      <!-- Main Content -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-left: 4px solid #6366f1; padding-left: 15px;">
          Report Details
        </h2>
        <div style="line-height: 1.8; color: #374151;">
          ${report.content.replace(/\n/g, "<br>")}
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
        <p>Generated by Finova AI Financial Assistant</p>
        <p>This report is for informational purposes only and should not be considered as financial advice.</p>
      </div>
    </div>
  `;
}
