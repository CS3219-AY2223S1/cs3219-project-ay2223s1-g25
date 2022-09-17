class WarrantException(Exception):
    """Base class for all pyCognito exceptions"""


class ForceChangePasswordException(WarrantException):
    def __init__(self, message, session):
        self.message = message
        self.session = session
    def __str__(self):
        return self.message


class TokenVerificationException(WarrantException):
    """Raised when token verification fails."""
