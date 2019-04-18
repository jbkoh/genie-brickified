import unittest
import requests

import json

import query

# Create your tests here.

class TestQuery(unittest.TestCase):
    def test_get_current_user_default(self):
        key = query._get_current_user()
        self.assertEqual(key, 'ebu3b:jasonkoh')
    
    def test_get_temperature_setpoint(self):
        self.assertEqual(query.get_temperature_setpoint(), 'EBU3B_RM_2150_COMMONSP')
    
    def test_get_zone_temperature_sensor(self):
        self.assertEqual(query.get_zone_temperature_sensor(), 'EBU3B_RM_2150_ZN_T')
    
    def test_get_thermal_power_sensor(self):
        self.assertEqual(query.get_thermal_power_sensor(), 'EBU3B_RM_2150_W_C_ADJ')
    
    def test_get_occupancy_command(self):
        self.assertEqual(query.get_occupancy_command(), 'EBU3B_RM_2150_OCC_CMD')

    def test_query_entity_tagset(self):
        self.assertEqual(query.query_entity_tagset('EBU3B_RM_2150_ZN_T'), 'Zone_Temperature_Sensor')

    def test_get_temperature(self):
        self.assertEqual(query.get_temperature(), None)
    
    def test_get_room_temperature(self):
        self.assertEqual(query.get_room_temperature(), None)
    
    def test_get_energy_usage(self):
        self.assertEqual(query.get_energy_usage(), None)
    
    def test_get_status(self):
        self.assertEqual(query.get_status(), None)

if __name__ == "__main__":
    unittest.main()
