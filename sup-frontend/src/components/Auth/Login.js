const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post('/auth/login', form);
    localStorage.setItem('token', res.data.token);

    // ✅ Get and send user's current location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await API.patch(
            '/users/update-location',
            { latitude, longitude },
            {
              headers: {
                Authorization: `Bearer ${res.data.token}`,
              },
            }
          );
          console.log('📍 Location updated');
        } catch (locationError) {
          console.error('❌ Location update failed', locationError);
        }

        navigate('/nearby'); // Move only after location update
      },
      (geoError) => {
        console.error('❌ Geolocation error:', geoError);
        navigate('/nearby'); // Still navigate even if location fails
      }
    );

  } catch (err) {
    alert('Login failed');
  }
};
