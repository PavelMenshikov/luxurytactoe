import unittest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from server import app

class BasicTests(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_loss_game(self):
        """Проверка проигрыша (не должно быть промокода)"""
        response = self.app.post('/api/game-over', json={'result': 'loss'})
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(data['promo'])

    def test_win_game(self):
        """Проверка выигрыша (должен быть промокод)"""
        response = self.app.post('/api/game-over', json={'result': 'win'})
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(data['promo'])
        self.assertTrue(str(data['promo']).startswith("LUX-") or "DEMO" in str(data['promo']))

if __name__ == "__main__":
    unittest.main()