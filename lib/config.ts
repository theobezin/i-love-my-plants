export const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : (process.env.NODE_ENV !== 'production');

export async function mockIdentify(): Promise<any> {
  await new Promise((res) => setTimeout(res, 300));
  return {
    suggestions: [
      {
        plant_name: 'Ficus elastica',
        plant_details: {
          watering_description: 'Water weekly.'
        }
      }
    ]
  };
}

export default { isDev, mockIdentify };
