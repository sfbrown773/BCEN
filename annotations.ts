export class TestAnnotations {
  private annotations: Array<{ type: string, description: string }> = [];

  // This method will be used to initially set the exam information.
  setExamInfo(examInfoArgs: any) {
    // Clear annotations before setting new ones, just in case
    this.annotations = [
      { type: 'Test Title', description: 'Your Test Title Here' }, // Placeholder for the test title, could be dynamic
      { type: 'Application', description: 'CBRN' }, // Example
      { type: 'Initial Status', description: 'Initial Application' },
      { type: 'International', description: examInfoArgs.state === 'International' ? 'Y' : 'N' },
      { type: 'Military', description: examInfoArgs.militaryStatusRequest ? 'Y' : 'N' },
      { type: 'Other Society Membership', description: examInfoArgs.membership === 'Yes' ? 'Y' : 'N' },
      { type: 'Exam Accommodations', description: examInfoArgs.accommodationRequest ? 'Y' : 'N' },
      { type: 'License Number', description: examInfoArgs.licenseNumber },
      { type: 'State', description: examInfoArgs.state },
    ];
  }

  // This method will be used to append additional annotations to the existing ones.
  appendAnnotations(additionalAnnotations: Array<{ type: string, description: string }>) {
    this.annotations = [...this.annotations, ...additionalAnnotations];
  }

  // This method retrieves the final annotations, after appending any new data.
  getAnnotations() {
    return this.annotations;
  }
}