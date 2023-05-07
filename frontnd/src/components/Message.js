import React from 'react'
import { Alert } from 'react-bootstrap'
function Message({variant, children}) {
  return (
    <div>
        <Alert variant={variant} className="text-center">
            <span class="fs-5 align-middle">{children}</span>
        </Alert>
    </div>
  )
}

export default Message