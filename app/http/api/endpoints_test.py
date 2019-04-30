import unittest
import requests

import json

import endpoints
	
# Create your tests here.

class TestEndpoints(unittest.TestCase):
    def test_get_current_user_default(self):
        key = endpoints._get_current_user()
        self.assertEqual(key, 'ebu3b:jasonkoh')

    def test_get_temperature_setpoint(self):
        self.assertEqual(endpoints.get_temperature_setpoint(), 
            'EBU3B_RM_2150_COMMONSP')

    def test_get_zone_temperature_sensor(self):
        self.assertEqual(querendpointsy.get_zone_temperature_sensor(), 
            'EBU3B_RM_2150_ZN_T')

    def test_get_thermal_power_sensor(self):
        self.assertEqual(endpoints.get_thermal_power_sensor(), 
            'EBU3B_RM_2150_W_C_ADJ')

    def test_get_occupancy_command(self):
        self.assertEqual(endpoints.get_occupancy_command(), 
            'EBU3B_RM_2150_OCC_CMD')

    def test_query_entity_tagset(self):
        self.assertEqual(endpoints.query_entity_tagset('EBU3B_RM_2150_ZN_T'), 
            'Zone_Temperature_Sensor')

    def test_get_temperature(self):
        self.assertEqual(endpoints.get_temperature(), None)

    def test_get_room_temperature(self):
        self.assertEqual(endpoints.get_room_temperature(), None)

    def test_get_energy_usage(self):
        self.assertEqual(endpoints.get_energy_usage(), None)

    def test_get_status(self):
        self.assertEqual(endpoints.get_status(), None)

if __name__ == "__main__":
    unittest.main()