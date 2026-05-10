const s = require('./email.styles');

const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${s.globalStyles}</style>
</head>
<body>
    <div style="${s.wrapper}">

        <!-- Header -->
        <div style="${s.header}">s
            <span style="${s.brandShuklas}">Shukla's</span>
            <span style="${s.brandFitness}">Fitness</span>
            <p style="${s.tagline}">BUILDING STRENGTH. DEFINING YOU.</p>
        </div>

        <!-- Content -->
        <div style="${s.body}">
            ${content}
        </div>

        <!-- Footer -->
        <div style="${s.footer}">
            <p style="${s.footerText}">
                © 2026 <span style="${s.footerBrand}">Shukla's Fitness</span>. All rights reserved.
            </p>
            <p style="${s.footerText}">This is an automated message, please do not reply.</p>
        </div>

    </div>
</body>
</html>
`;

module.exports = emailWrapper;