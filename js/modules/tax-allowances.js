// Tax Allowances Module

const TaxAllowances = {
    async render(container) {
        const taxYear = businessManager.currentBusiness?.taxYear || '2025-26';

        container.innerHTML = `
            <div class="page-header">
                <h1 class="page-title">UK Tax Allowances</h1>
                <p class="page-subtitle">Tax Year ${taxYear} - Quick Reference Guide</p>
            </div>

            <div class="row">
                <div class="col-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Personal Allowances</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 1rem;">
                                <div class="allowance-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Personal Allowance</strong>
                                            <div class="text-small text-muted">Tax-free income</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="color: var(--success-color);">£12,570</strong>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="allowance-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Blind Person's Allowance</strong>
                                            <div class="text-small text-muted">Additional allowance</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="color: var(--success-color);">£3,130</strong>
                                        </div>
                                    </div>
                                </div>

                                <div class="allowance-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Marriage Allowance</strong>
                                            <div class="text-small text-muted">Transfer to spouse</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="color: var(--success-color);">£1,260</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Trading & Property</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 1rem;">
                                <div class="allowance-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Trading Allowance</strong>
                                            <div class="text-small text-muted">Self-employment income</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="color: var(--success-color);">£1,000</strong>
                                        </div>
                                    </div>
                                </div>

                                <div class="allowance-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Property Allowance</strong>
                                            <div class="text-small text-muted">Rental income</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="color: var(--success-color);">£1,000</strong>
                                        </div>
                                    </div>
                                </div>

                                <div class="allowance-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Rent-a-Room Relief</strong>
                                            <div class="text-small text-muted">Room rental income</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="color: var(--success-color);">£7,500</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Capital & Dividends</h3>
                        </div>
                        <div class="card-body">
                            <div style="display: grid; gap: 1rem;">
                                <div class="allowance-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Capital Gains Allowance</strong>
                                            <div class="text-small text-muted">Annual exempt amount</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="color: var(--success-color);">£3,000</strong>
                                        </div>
                                    </div>
                                </div>

                                <div class="allowance-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Dividend Allowance</strong>
                                            <div class="text-small text-muted">Tax-free dividends</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="color: var(--success-color);">£500</strong>
                                        </div>
                                    </div>
                                </div>

                                <div class="allowance-item">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <strong>Personal Savings Allowance</strong>
                                            <div class="text-small text-muted">Basic rate taxpayers</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <strong style="color: var(--success-color);">£1,000</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mileage Allowance -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Mileage Allowance</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: 8px;">
                                <h4 style="margin-bottom: 1rem;">Cars and Vans</h4>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>First 10,000 miles per year</span>
                                    <strong style="color: var(--success-color);">45p per mile</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Above 10,000 miles per year</span>
                                    <strong style="color: var(--success-color);">25p per mile</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div style="padding: 1.5rem; background: var(--bg-secondary); border-radius: 8px;">
                                <h4 style="margin-bottom: 1rem;">Motorcycles and Bicycles</h4>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Motorcycles</span>
                                    <strong style="color: var(--success-color);">24p per mile</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Bicycles</span>
                                    <strong style="color: var(--success-color);">20p per mile</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tax Rates Reference -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Income Tax Rates ${taxYear}</h3>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Band</th>
                                <th>Income Range</th>
                                <th>Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Personal Allowance</td>
                                <td>£0 - £12,570</td>
                                <td><span class="badge badge-success">0%</span></td>
                            </tr>
                            <tr>
                                <td>Basic Rate</td>
                                <td>£12,571 - £50,270</td>
                                <td><span class="badge badge-info">20%</span></td>
                            </tr>
                            <tr>
                                <td>Higher Rate</td>
                                <td>£50,271 - £125,140</td>
                                <td><span class="badge badge-warning">40%</span></td>
                            </tr>
                            <tr>
                                <td>Additional Rate</td>
                                <td>Over £125,140</td>
                                <td><span class="badge badge-danger">45%</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- National Insurance Rates -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">National Insurance Contributions ${taxYear}</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <h4 style="margin-bottom: 1rem;">Employee (Class 1)</h4>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Income Range</th>
                                        <th>Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>£0 - £12,570</td>
                                        <td><span class="badge badge-success">0%</span></td>
                                    </tr>
                                    <tr>
                                        <td>£12,571 - £50,270</td>
                                        <td><span class="badge badge-info">12%</span></td>
                                    </tr>
                                    <tr>
                                        <td>Over £50,270</td>
                                        <td><span class="badge badge-warning">2%</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-6">
                            <h4 style="margin-bottom: 1rem;">Self-Employed (Class 2 & 4)</h4>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Rate/Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Class 2 (profits over £12,570)</td>
                                        <td>£3.45 per week</td>
                                    </tr>
                                    <tr>
                                        <td>Class 4 (£12,571 - £50,270)</td>
                                        <td><span class="badge badge-info">9%</span></td>
                                    </tr>
                                    <tr>
                                        <td>Class 4 (over £50,270)</td>
                                        <td><span class="badge badge-warning">2%</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add custom styles
        const style = `
            <style>
                .allowance-item {
                    padding: 0.75rem;
                    background: var(--bg-secondary);
                    border-radius: 6px;
                }
            </style>
        `;
        container.innerHTML += style;
    }
};
